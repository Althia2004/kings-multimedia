<?php

namespace App\Policies;

use App\Models\Photo;
use App\Models\User;

class PhotoPolicy
{
    public function view(User $user, Photo $photo): bool
    {
        return $user->isAdmin() || $photo->booking?->client?->user_id === $user->id;
    }

    public function release(User $user): bool
    {
        return $user->isAdmin();
    }
}
