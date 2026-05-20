<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $user->isAdmin() || $payment->booking?->client?->user_id === $user->id;
    }

    public function update(User $user): bool
    {
        return $user->isAdmin();
    }
}
