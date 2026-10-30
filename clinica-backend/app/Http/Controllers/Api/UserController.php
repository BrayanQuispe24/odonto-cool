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
use Illuminate\Support\Facades\Storage;

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
            'message' => 'Usuario creado exitosamente. Se ha enviado un correo con las credenciales de acceso.',
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

    public function updateMe(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => 'required|email|string|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|max:20',
            'nombre' => 'nullable|string|max:255',
            'apellido' => 'nullable|string|max:255',
            'telefonos' => 'nullable|array',
            'telefonos.*' => 'nullable|string|max:50',
            'especialidades' => 'nullable|array',
            'especialidades.*' => 'nullable|string|max:100',
        ], [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingrese un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está en uso por otro usuario.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
        ]);

        $userData = [
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($userData);

        if ($user->doctor) {
            $doctorData = [];
            if (isset($validated['nombre'])) {
                $doctorData['nombre'] = $validated['nombre'];
            }
            if (isset($validated['apellido'])) {
                $doctorData['apellido'] = $validated['apellido'];
            }
            if (array_key_exists('telefonos', $validated)) {
                $doctorData['telefonos'] = array_values(array_filter($validated['telefonos'] ?? [], fn($t) => filled($t)));
            }
            if (array_key_exists('especialidades', $validated)) {
                $doctorData['especialidades'] = array_values(array_filter($validated['especialidades'] ?? [], fn($e) => filled($e)));
            }

            if (!empty($doctorData)) {
                $user->doctor->update($doctorData);
            }
        }

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'usuario' => $user->fresh()->load(['rol', 'doctor']),
        ], 200);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'foto.required' => 'Debe seleccionar una imagen.',
            'foto.image' => 'El archivo seleccionado debe ser una imagen válida.',
            'foto.mimes' => 'Solo se permiten imágenes en formato JPG, PNG o WEBP.',
            'foto.max' => 'La imagen no debe superar los 2MB de tamaño.',
        ]);

        $user = $request->user();

        // Eliminar avatar anterior si existe
        if ($user->foto_perfil) {
            $oldPath = str_replace('/storage/', '', $user->foto_perfil);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('foto')->store('avatars', 'public');
        $user->update([
            'foto_perfil' => '/storage/' . $path,
        ]);

        return response()->json([
            'message' => 'Foto de perfil actualizada exitosamente',
            'usuario' => $user->fresh()->load(['rol', 'doctor']),
        ], 200);
    }

    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->foto_perfil) {
            $oldPath = str_replace('/storage/', '', $user->foto_perfil);
            Storage::disk('public')->delete($oldPath);
            $user->update(['foto_perfil' => null]);
        }

        return response()->json([
            'message' => 'Foto de perfil eliminada exitosamente',
            'usuario' => $user->fresh()->load(['rol', 'doctor']),
        ], 200);
    }
}
