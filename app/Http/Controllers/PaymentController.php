<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Payments/index', [
            'payments' => Payment::with('booking.client.user')
                ->latest()
                ->get()
                ->map(fn (Payment $payment) => $this->serialize($payment)),
        ]);
    }

    public function mine(Request $request): Response
    {
        $client = $request->user()->client;

        return Inertia::render('User/Payments/index', [
            'payments' => $client
                ? Payment::with(['booking', 'transactions'])->whereHas('booking', fn ($query) => $query->where('client_id', $client->id))->latest()->get()->map(fn (Payment $payment) => $this->serialize($payment))
                : [],
        ]);
    }

    public function update(Request $request, Payment $payment): RedirectResponse
    {
        abort_if(! $request->user()?->isAdmin(), 403);

        $validated = $request->validate([
            'amount_due' => ['required', 'numeric', 'min:0'],
            'amount_paid' => ['required', 'numeric', 'min:0'],
            'payment_date' => ['nullable', 'date'],
        ]);

        $amountDue = (float) $validated['amount_due'];
        $amountPaid = min((float) $validated['amount_paid'], $amountDue);
        $remaining = max($amountDue - $amountPaid, 0);
        $status = Payment::statusFor($amountDue, $amountPaid);

        $payment->update([
            'amount_due' => $amountDue,
            'amount_paid' => $amountPaid,
            'remaining_balance' => $remaining,
            'status' => $status,
            'payment_date' => $validated['payment_date'] ?? now()->toDateString(),
        ]);

        if ($status !== 'Paid') {
            $this->notifyPaymentReminder($payment);
        }

        return back()->with('success', 'Payment updated.');
    }

    public function simulate(Request $request, Payment $payment): RedirectResponse
    {
        $payment->loadMissing('booking.client.user');
        abort_if($payment->booking?->client?->user_id !== $request->user()?->id, 403);

        $validated = $request->validate([
            'reference_number' => ['required', 'string', 'max:255', 'unique:payment_transactions,reference_number'],
            'payment_method' => ['required', 'string', 'in:GCash,Maya,Credit Card,Bank Transfer'],
        ]);

        $amount = (float) $payment->remaining_balance;
        $eventType = $payment->booking?->event_type ?? 'booking';

        DB::transaction(function () use ($amount, $eventType, $payment, $request, $validated): void {
            PaymentTransaction::create([
                'payment_id' => $payment->id,
                'reference_number' => $validated['reference_number'],
                'payment_method' => $validated['payment_method'],
                'amount' => $amount,
                'status' => 'Paid',
            ]);

            $payment->update([
                'amount_paid' => $payment->amount_due,
                'remaining_balance' => 0,
                'status' => 'Paid',
                'payment_date' => now()->toDateString(),
            ]);

            Notification::create([
                'user_id' => $request->user()->id,
                'title' => 'Payment received',
                'message' => "Payment received for {$eventType} booking.",
                'type' => 'payment_received',
            ]);
        });

        return back()->with('success', 'Payment received successfully.');
    }

    private function serialize(Payment $payment): array
    {
        $latestTransaction = $payment->transactions?->sortByDesc('created_at')->first();

        return [
            'id' => $payment->id,
            'bookingId' => $payment->booking_id,
            'client' => $payment->booking?->client?->user?->name,
            'eventType' => $payment->booking?->event_type,
            'amountDue' => (float) $payment->amount_due,
            'amountPaid' => (float) $payment->amount_paid,
            'remaining' => (float) $payment->remaining_balance,
            'status' => $payment->status,
            'paymentDate' => $payment->payment_date?->toDateString(),
            'latestTransaction' => $latestTransaction
                ? [
                    'referenceNumber' => $latestTransaction->reference_number,
                    'paymentMethod' => $latestTransaction->payment_method,
                    'status' => $latestTransaction->status,
                ]
                : null,
        ];
    }

    private function notifyPaymentReminder(Payment $payment): void
    {
        $payment->loadMissing('booking.client.user');
        $userId = $payment->booking?->client?->user_id;

        if (! $userId) {
            return;
        }

        Notification::create([
            'user_id' => $userId,
            'title' => 'Payment reminder',
            'message' => 'Remaining payment due.',
            'type' => 'payment_reminder',
        ]);
    }
}
