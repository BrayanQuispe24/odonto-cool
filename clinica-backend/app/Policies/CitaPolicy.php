<?php

namespace App\Policies;

use App\Models\Cita;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CitaPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Cita $cita): bool
    {
        return true;
    }

    /**
     * Solo usuarios con rol Doctor pueden registrar citas.
     */
    public function create(User $authUser): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Doctor';
    }

    public function update(User $authUser, Cita $cita): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor']);
    }

    public function delete(User $authUser, Cita $cita): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor']);
    }
}
