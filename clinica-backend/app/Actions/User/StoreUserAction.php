<?php

namespace App\Actions\User;

use App\DTOs\User\StoreUserDTO;
use App\Mail\UserCredentialsMail;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class StoreUserAction
{
    public function execute(StoreUserDTO $dto): User
    {
        $rol = Rol::findOrFail($dto->rol_id);
        $codigoUsuario = $this->generarCodigoUsuario($rol);
        $plainPassword = $dto->password;

        $user = DB::transaction(function () use ($dto, $codigoUsuario, $plainPassword) {
            $createdUser = User::create([
                'codigo_usuario' => $codigoUsuario,
                'email' => $dto->email,
                'password' => Hash::make($plainPassword),
                'rol_id' => $dto->rol_id,
            ]);

            $createdUser->load('rol');
            return $createdUser;
        });

        // El envío de correo se realiza fuera del bloqueo de la transacción de base de datos
        // para prevenir que la latencia del SMTP bloquee las conexiones de la base de datos.
        try {
            Mail::to($user->email)->send(new UserCredentialsMail($user, $plainPassword));
        } catch (\Throwable $e) {
            Log::error("Fallo al entregar correo a {$user->email}: " . $e->getMessage(), [
                'exception' => $e,
            ]);

            // Se elimina el usuario si el correo no pudo ser entregado
            $user->delete();

            throw ValidationException::withMessages([
                'email' => 'No se pudo entregar el correo a esta dirección. Verifique que el correo electrónico exista y esté habilitado para recibir mensajes.',
            ]);
        }

        return $user;
    }

    private function generarCodigoUsuario(Rol $rol): string
    {
        $prefix = strtoupper(substr($rol->nombre, 0, 3));
        $ultimoCodigo = User::where('codigo_usuario', 'LIKE', "{$prefix}-%")
            ->orderBy('id', 'desc')
            ->value('codigo_usuario');

        $nextNum = 1;
        if ($ultimoCodigo && preg_match('/-(\d+)$/', $ultimoCodigo, $matches)) {
            $nextNum = ((int) $matches[1]) + 1;
        }

        return sprintf('%s-%03d', $prefix, $nextNum);
    }
}
