<?php

namespace App\Policies;

use App\Models\Diente;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DientePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Diente $diente): bool
    {
        return true;
    }

    /**
     * Solo usuarios con rol Administrador pueden registrar piezas dentales.
     */
    public function create(User $authUser): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    /**
     * Solo usuarios con rol Administrador pueden actualizar una pieza dental.
     */
    public function update(User $authUser, Diente $diente): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    /**
     * Solo usuarios con rol Administrador pueden eliminar una pieza dental.
     */
    public function delete(User $authUser, Diente $diente): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }
}
