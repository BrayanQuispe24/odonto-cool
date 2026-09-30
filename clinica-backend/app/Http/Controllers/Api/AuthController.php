<?php

namespace App\Http\Controllers\Api;

use App\Actions\Auth\LoginAction;
use App\Actions\Auth\LogoutAction;
use App\Actions\Auth\RegisterAction;
use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterAction $action): JsonResponse
    {
        //primero la request lo vamos a transformar en un dto 
        $dto = RegisterDTO::fromRequest($request);
        //aca lo que estamos haciendo es llamar al policy de register pero para eso necesitamos pasarle la instancia del modelo y del dto
        Gate::authorize('register', [User::class, $dto]);
        $resultado = $action->execute($dto);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $resultado['user'],
            'token' => $resultado['token'],
            'token_type' => $resultado['token_type']
        ], 201);
    }

    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        $dto = LoginDTO::fromRequest($request);
        $resultado = $action->execute($dto);

        if (isset($resultado['status']) && $resultado['status'] >= 400) {
            return response()->json([
                'message' => $resultado['message'] ?? 'Credenciales incorrectas',
            ], $resultado['status']);
        }

        return response()->json([
            'message' => 'Inicio de sesion exitoso',
            'token' => $resultado['token'],
            'usuario' => $resultado['usuario'],
            'token_type' => $resultado['token_type']
        ], 200);
    }

    public function logout(LogoutAction $action): JsonResponse
    {
        Gate::authorize('logout', [User::class]);
        $resultado = $action->execute();
        return response()->json([
            'message' => $resultado['message']
        ], $resultado['status']);
    }
}
