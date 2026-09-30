<?php

namespace App\Policies;

use App\Models\Servicio;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServicioPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return true;
    }

    public function view(User $authUser, Servicio $servicio): bool
    {
        return true;
    }

    /**
     * Solo usuarios con rol Administrador pueden registrar nuevos servicios/precios.
     */
    public function create(User $authUser): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    /**
     * Solo usuarios con rol Administrador pueden actualizar un servicio/precio.
     */
    public function update(User $authUser, Servicio $servicio): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    /**
     * Solo usuarios con rol Administrador pueden eliminar un servicio.
     */
    public function delete(User $authUser, Servicio $servicio): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }
}
