<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->canManageEmployees();
    }

    public function update(User $user, Employee $employee): bool
    {
        return $user->canManageEmployees()
            && (! $employee->user?->isSuperAdmin() || $employee->user_id === $user->id);
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->canManageEmployees()
            && $employee->user_id !== $user->id
            && ! $employee->user?->isSuperAdmin();
    }
}
