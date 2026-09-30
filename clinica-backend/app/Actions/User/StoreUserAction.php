<?php

namespace App\Actions\User;

use App\DTOs\User\StoreUserDTO;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StoreUserAction
{
    public function execute(StoreUserDTO $dto): User
    {
        $rol = Rol::findOrFail($dto->rol_id);
        $codigoUsuario = $this->generarCodigoUsuario($rol);

        $user = User::create([
            'codigo_usuario' => $codigoUsuario,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'rol_id' => $dto->rol_id,
        ]);

        return $user->load('rol');
    }

    private function generarCodigoUsuario(Rol $rol): string
    {
        $prefix = strtoupper(substr($rol->nombre, 0, 3));
        $count = User::where('rol_id', $rol->id)->count();
        return sprintf('%s-%03d', $prefix, $count + 1);
    }
}
