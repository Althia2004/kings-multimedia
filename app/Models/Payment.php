<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['booking_id', 'amount_due', 'amount_paid', 'remaining_balance', 'status', 'payment_date'])]
class Payment extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount_due' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'remaining_balance' => 'decimal:2',
            'payment_date' => 'date',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public static function statusFor(float $amountDue, float $amountPaid): string
    {
        $remaining = max($amountDue - $amountPaid, 0);

        if ($remaining <= 0 && $amountDue > 0) {
            return 'Paid';
        }

        return $amountPaid > 0 ? 'Partial' : 'Unpaid';
    }
}
