<?php

namespace App\Policies;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DoctorPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor']);
    }

    public function view(User $authUser, Doctor $doctor): bool
    {
        if ($authUser->rol && $authUser->rol->nombre === 'Administrador') {
            return true;
        }

        return $authUser->rol && $authUser->rol->nombre === 'Doctor' && $authUser->sucursal_id === $doctor->sucursal_id;
    }

    public function create(User $authUser): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    public function update(User $authUser, Doctor $doctor): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    public function delete(User $authUser, Doctor $doctor): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }
}
