<?php

namespace App\Policies;

use App\Models\Paciente;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PacientePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Paciente $paciente): bool
    {
        return true;
    }

    public function create(User $authUser): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor']);
    }

    public function update(User $authUser, Paciente $paciente): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor']);
    }

    public function delete(User $authUser, Paciente $paciente): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }
}
