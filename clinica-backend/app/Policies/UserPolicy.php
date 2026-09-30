<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    public function view(User $authUser, User $user): bool
    {
        if ($authUser->rol && $authUser->rol->nombre === 'Administrador') {
            return true;
        }

        return (int) $authUser->id === (int) $user->id;
    }

    public function create(User $authUser): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    public function update(User $authUser, User $user): bool
    {
        if ($authUser->rol && $authUser->rol->nombre === 'Administrador') {
            return true;
        }

        return (int) $authUser->id === (int) $user->id;
    }

    public function delete(User $authUser, User $user): bool
    {
        // Administradores pueden eliminar excepto a sí mismos
        if ($authUser->rol && $authUser->rol->nombre === 'Administrador') {
            return (int) $authUser->id !== (int) $user->id;
        }

        return false;
    }
}
