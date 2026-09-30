<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\LoginDTO;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginAction
{
    public function __construct() {}

    public function execute(LoginDTO $dto): array
    {
        //verificamos la existencia del usuario
        $usuario = User::where('email', '=', $dto->email)->first();
        if (!$usuario || !Hash::check($dto->password, $usuario->password)) {
            return [
                'message' => 'Credenciales incorrectas',
                'status' => 401
            ];
        }
        //creamos el token
        $token = $usuario->createToken('auth_token')->plainTextToken;
        $usuario->load(['rol', 'doctor']);
        return [
            'token' => $token,
            'usuario' => $usuario,
            'token_type' => 'Bearer'
        ];
    }
}
