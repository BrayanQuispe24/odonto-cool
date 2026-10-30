<?php

namespace App\Policies;

use App\Models\Proforma;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProformaPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $authUser): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor', 'Recepcionista']);
    }

    public function view(User $authUser, Proforma $proforma): bool
    {
        if (!$authUser->rol) {
            return false;
        }

        if (in_array($authUser->rol->nombre, ['Administrador', 'Recepcionista'])) {
            return true;
        }

        if ($authUser->rol->nombre === 'Doctor') {
            $doctorSucursal = $authUser->sucursal_id ?? $authUser->doctor?->sucursal_id;
            return $doctorSucursal && $proforma->sucursal_id === $doctorSucursal;
        }

        return false;
    }

    public function create(User $authUser): bool
    {
        return $authUser->rol && in_array($authUser->rol->nombre, ['Administrador', 'Doctor', 'Recepcionista']);
    }

    public function update(User $authUser, Proforma $proforma): bool
    {
        if (!$authUser->rol) {
            return false;
        }

        if ($authUser->rol->nombre === 'Administrador') {
            return true;
        }

        if ($authUser->rol->nombre === 'Doctor') {
            $doctorSucursal = $authUser->sucursal_id ?? $authUser->doctor?->sucursal_id;
            return $doctorSucursal && $proforma->sucursal_id === $doctorSucursal;
        }

        return false;
    }

    public function delete(User $authUser, Proforma $proforma): bool
    {
        if (!$authUser->rol) {
            return false;
        }

        if ($authUser->rol->nombre === 'Administrador') {
            return true;
        }

        if ($authUser->rol->nombre === 'Doctor') {
            $doctorSucursal = $authUser->sucursal_id ?? $authUser->doctor?->sucursal_id;
            return $doctorSucursal && $proforma->sucursal_id === $doctorSucursal;
        }

        return false;
    }
}
