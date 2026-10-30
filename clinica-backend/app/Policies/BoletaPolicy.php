<?php

namespace App\Policies;

use App\Models\BoletaServicioPrestado;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BoletaPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor', 'Recepcionista']);
    }

    public function view(User $authUser, BoletaServicioPrestado $boleta): bool
    {
        if (!$authUser->rol) {
            return false;
        }

        if (in_array($authUser->rol->nombre, ['Administrador', 'Recepcionista'])) {
            return true;
        }

        if ($authUser->rol->nombre === 'Doctor') {
            $doctorId = $authUser->doctor?->id;
            $doctorSucursal = $authUser->sucursal_id ?? $authUser->doctor?->sucursal_id;

            if ($doctorId && $boleta->doctor_id === $doctorId) {
                return true;
            }

            if ($doctorSucursal && ($boleta->cita?->sucursal_id === $doctorSucursal || $boleta->doctor?->sucursal_id === $doctorSucursal)) {
                return true;
            }
        }

        return false;
    }

    public function create(User $authUser): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor', 'Recepcionista']);
    }

    public function update(User $authUser, BoletaServicioPrestado $boleta): bool
    {
        if (!$authUser->rol) {
            return false;
        }

        if ($authUser->rol->nombre === 'Administrador') {
            return true;
        }

        if ($authUser->rol->nombre === 'Doctor') {
            $doctorId = $authUser->doctor?->id;
            return $doctorId && $boleta->doctor_id === $doctorId;
        }

        return false;
    }

    /**
     * Solo un Administrador puede eliminar boletas contables del sistema.
     */
    public function delete(User $authUser, BoletaServicioPrestado $boleta): bool
    {
        return $authUser->rol && $authUser->rol->nombre === 'Administrador';
    }

    /**
     * Regla para modificar cuotas:
     * Si la boleta está completada, solo el Administrador puede intervenir.
     */
    public function modifyCuotas(User $authUser, BoletaServicioPrestado $boleta): bool
    {
        if (!$authUser->rol) {
            return false;
        }

        if ($authUser->rol->nombre === 'Administrador') {
            return true;
        }

        // Si ya está completada, ningún otro rol puede modificar cuotas
        if ($boleta->estado === 'completado') {
            return false;
        }

        return in_array($authUser->rol->nombre, ['Doctor', 'Recepcionista']);
    }
}
