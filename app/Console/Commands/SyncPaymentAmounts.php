<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Payment;
use App\Support\PackagePricing;
use Illuminate\Console\Command;

class SyncPaymentAmounts extends Command
{
    protected $signature = 'sync:payment-amounts';

    protected $description = 'Create or repair booking payment records using Kings Media package pricing.';

    public function handle(): int
    {
        $created = 0;
        $updated = 0;

        Booking::with('payment')->chunkById(100, function ($bookings) use (&$created, &$updated): void {
            foreach ($bookings as $booking) {
                $amountDue = PackagePricing::priceFor(
                    $booking->event_type,
                    (float) ($booking->payment?->amount_due ?? 0),
                );

                if ($amountDue <= 0) {
                    continue;
                }

                if (! $booking->payment) {
                    Payment::create([
                        'booking_id' => $booking->id,
                        'amount_due' => $amountDue,
                        'amount_paid' => 0,
                        'remaining_balance' => $amountDue,
                        'status' => 'Unpaid',
                    ]);

                    $created++;

                    continue;
                }

                $amountPaid = min((float) $booking->payment->amount_paid, $amountDue);
                $remaining = max($amountDue - $amountPaid, 0);
                $status = Payment::statusFor($amountDue, $amountPaid);

                if (
                    (float) $booking->payment->amount_due === $amountDue
                    && (float) $booking->payment->amount_paid === $amountPaid
                    && (float) $booking->payment->remaining_balance === $remaining
                    && $booking->payment->status === $status
                ) {
                    continue;
                }

                $booking->payment->update([
                    'amount_due' => $amountDue,
                    'amount_paid' => $amountPaid,
                    'remaining_balance' => $remaining,
                    'status' => $status,
                    'payment_date' => $status === 'Paid'
                        ? ($booking->payment->payment_date ?? now()->toDateString())
                        : null,
                ]);

                $updated++;
            }
        });

        $this->info("Created {$created} payment records. Updated {$updated} payment records.");

        return self::SUCCESS;
    }
}
