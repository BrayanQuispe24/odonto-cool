<?php

namespace App\Policies;

use App\Models\Sucursal;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SucursalPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Sucursal $sucursal): bool
    {
        return true;
    }

    public function create(User $authUser): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    public function update(User $authUser, Sucursal $sucursal): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    public function delete(User $authUser, Sucursal $sucursal): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    public function assignDoctor(User $authUser, Sucursal $sucursal): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }
}
