<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterDTO;
use App\Helpers\HelperFunctions;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterAction
{
    public function __construct() {}

    public function execute(RegisterDTO $dto): array
    {
        //primero buscamos al rol
        $rol = Rol::where('id', '=', $dto->rol_id)->first();
        if (!$rol) {
            return [
                'message' => 'El rol no existe',
                'status' => 404
            ];
        }
        $codigo_usuario = $this->generarCodigoUsuario($rol);
        $usuario = User::create([
            'codigo_usuario' => $codigo_usuario,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'rol_id' => $dto->rol_id,
        ]);

        //creamos el token
        $token = $usuario->createToken('auth-token')->plainTextToken;

        //retornamos el token y los datos del usuario
        return [
            'token' => $token,
            'usuario' => $usuario,
            'token_type' => 'Bearer'
        ];
    }

    private function generarCodigoUsuario(Rol $rol): string
    {
        $cantidad = User::where('rol_id', $rol->id)->count();
        $codigo = "US" . '-' . $rol->nombre() . '-' . $cantidad + 1;
        return $codigo;
    }
}
