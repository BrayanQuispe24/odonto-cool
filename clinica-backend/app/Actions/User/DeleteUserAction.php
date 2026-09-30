<?php

namespace App\Actions\User;

use App\Models\User;

class DeleteUserAction
{
    public function execute(User $user): bool
    {
        return (bool) $user->delete();
    }
}
