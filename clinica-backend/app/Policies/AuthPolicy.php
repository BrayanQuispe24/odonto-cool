<?php

namespace App\Policies;

use App\DTOs\Auth\RegisterDTO;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class AuthPolicy
{
    use HandlesAuthorization;

    /**
     * @param User $usuario Laravel pasa el usuario autenticado como primer parámetro de manera automática.
     * @param RegisterDTO $dto 
     */
    public function register(User $usuario, RegisterDTO $dto): Response
    {
        //Laravel pasa el usuario autenticado como primer parámetro de manera automática.
        $rolRegister = Rol::where('id', '=', $dto->rol_id)->first();
        //solo el usuario con rol administrador podra registrar a los doctores
        if ($usuario->rol->nombre == 'Administrador' && $rolRegister->nombre == 'Doctor') {
            return Response::allow();
        }
        if ($usuario->rol->nombre == 'Doctor' && $rolRegister->nombre == 'Paciente') {
            return Response::allow();
        }
        return Response::deny();
    }

    /**
     * Determina si el usuario autenticado puede cerrar sesión.
     * @param User $usuario Laravel pasa el usuario autenticado como primer parámetro de manera automática.
     */
    public function logout(User $usuario): bool
    {
        return $usuario->currentAccessToken() !== null;
    }
}
