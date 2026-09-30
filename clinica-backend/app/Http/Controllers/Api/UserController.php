<?php

namespace App\Http\Controllers\Api;

use App\Actions\User\DeleteUserAction;
use App\Actions\User\ListUsersAction;
use App\Actions\User\ShowUserAction;
use App\Actions\User\StoreUserAction;
use App\Actions\User\UpdateUserAction;
use App\DTOs\User\StoreUserDTO;
use App\DTOs\User\UpdateUserDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function index(ListUsersAction $action): JsonResponse
    {
        Gate::authorize('viewAny', User::class);
        $usuarios = $action->execute();

        return response()->json([
            'usuarios' => $usuarios
        ], 200);
    }

    public function store(StoreUserRequest $request, StoreUserAction $action): JsonResponse
    {
        Gate::authorize('create', User::class);
        $dto = StoreUserDTO::fromRequest($request);
        $usuario = $action->execute($dto);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'usuario' => $usuario
        ], 201);
    }

    public function show(User $user, ShowUserAction $action): JsonResponse
    {
        Gate::authorize('view', $user);
        $usuario = $action->execute($user);

        return response()->json([
            'usuario' => $usuario
        ], 200);
    }

    public function update(UpdateUserRequest $request, User $user, UpdateUserAction $action): JsonResponse
    {
        Gate::authorize('update', $user);
        $dto = UpdateUserDTO::fromRequest($request);
        $usuarioActualizado = $action->execute($user, $dto);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'usuario' => $usuarioActualizado
        ], 200);
    }

    public function destroy(User $user, DeleteUserAction $action): JsonResponse
    {
        Gate::authorize('delete', $user);
        $action->execute($user);

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ], 200);
    }

    public function me(Request $request, ShowUserAction $action): JsonResponse
    {
        $usuario = $action->execute($request->user());

        return response()->json([
            'usuario' => $usuario
        ], 200);
    }
}
