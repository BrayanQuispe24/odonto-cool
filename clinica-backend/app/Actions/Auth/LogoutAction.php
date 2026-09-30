<?php

namespace App\Actions\Auth;

use Illuminate\Support\Facades\Auth;

class LogoutAction
{
    public function __construct() {}

    public function execute(): array
    {
        $usuario = Auth::user();
        $usuario->currentAccessToken()->delete();

        return [
            'message' => 'Usuario desconectado correctamente',
            'status' => 200
        ];
    }
}
