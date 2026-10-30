<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterDTO;
use App\Helpers\HelperFunctions;
use App\Mail\UserCredentialsMail;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class RegisterAction
{
    public function __construct() {}

    public function execute(RegisterDTO $dto): array
    {
        // primero buscamos al rol
        $rol = Rol::where('id', '=', $dto->rol_id)->first();
        if (!$rol) {
            return [
                'message' => 'El rol no existe',
                'status' => 404
            ];
        }
        $codigo_usuario = $this->generarCodigoUsuario($rol);
        $plainPassword = $dto->password;

        return DB::transaction(function () use ($dto, $codigo_usuario, $plainPassword) {
            $usuario = User::create([
                'codigo_usuario' => $codigo_usuario,
                'email' => $dto->email,
                'password' => Hash::make($plainPassword),
                'rol_id' => $dto->rol_id,
            ]);

            $usuario->load('rol');

            // Enviar correo con credenciales de forma atómica
            try {
                Mail::to($usuario->email)->send(new UserCredentialsMail($usuario, $plainPassword));
            } catch (\Throwable $e) {
                Log::error("Fallo al enviar credenciales a {$usuario->email}: " . $e->getMessage(), [
                    'exception' => $e,
                ]);

                throw ValidationException::withMessages([
                    'email' => 'No se pudo entregar el correo a esta dirección. Verifique que el correo electrónico exista y esté habilitado para recibir mensajes.',
                ]);
            }

            // creamos el token
            $token = $usuario->createToken('auth-token')->plainTextToken;

            // retornamos el token y los datos del usuario
            return [
                'token' => $token,
                'usuario' => $usuario,
                'token_type' => 'Bearer'
            ];
        });
    }

    private function generarCodigoUsuario(Rol $rol): string
    {
        $prefix = strtoupper(substr($rol->nombre, 0, 3));
        $cantidad = User::where('rol_id', $rol->id)->count();
        return sprintf('%s-%03d', $prefix, $cantidad + 1);
    }
}
