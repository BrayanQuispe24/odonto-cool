<?php

namespace App\Http\Controllers\Api;

use App\Actions\Cita\DeleteCitaAction;
use App\Actions\Cita\ListCitasAction;
use App\Actions\Cita\ShowCitaAction;
use App\Actions\Cita\StoreCitaAction;
use App\Actions\Cita\UpdateCitaAction;
use App\DTOs\Cita\StoreCitaDTO;
use App\DTOs\Cita\UpdateCitaDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cita\StoreCitaRequest;
use App\Http\Requests\Cita\UpdateCitaRequest;
use App\Models\Cita;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CitaController extends Controller
{
    public function index(Request $request, ListCitasAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Cita::class);

        $user = $request->user();
        $sucursalId = $request->query('sucursal_id') ? (int) $request->query('sucursal_id') : null;

        if ($user->rol && $user->rol->nombre === 'Doctor') {
            $sucursalId = $user->sucursal_id;
        }

        $doctorId = $request->query('doctor_id') ? (int) $request->query('doctor_id') : null;
        $fecha = $request->query('fecha') ? (string) $request->query('fecha') : null;
        $estado = $request->query('estado') ? (string) $request->query('estado') : null;

        $citas = $action->execute($sucursalId, $doctorId, $fecha, $estado);

        return response()->json([
            'citas' => $citas
        ], 200);
    }

    public function store(StoreCitaRequest $request, StoreCitaAction $action): JsonResponse
    {
        Gate::authorize('create', Cita::class);

        $user = $request->user();
        if ($user->rol && $user->rol->nombre === 'Doctor') {
            $request->merge(['sucursal_id' => $user->sucursal_id]);
        }

        $dto = StoreCitaDTO::fromRequest($request);
        $cita = $action->execute($dto);

        return response()->json([
            'message' => 'Cita médica registrada exitosamente',
            'cita' => $cita
        ], 201);
    }

    public function show(Cita $cita, ShowCitaAction $action): JsonResponse
    {
        Gate::authorize('view', $cita);

        $citaDetalle = $action->execute($cita);

        return response()->json([
            'cita' => $citaDetalle
        ], 200);
    }

    public function update(UpdateCitaRequest $request, Cita $cita, UpdateCitaAction $action): JsonResponse
    {
        Gate::authorize('update', $cita);

        $user = $request->user();
        if ($user->rol && $user->rol->nombre === 'Doctor') {
            $request->merge(['sucursal_id' => $user->sucursal_id]);
        }

        $dto = UpdateCitaDTO::fromRequest($request);
        $citaActualizada = $action->execute($cita, $dto);

        return response()->json([
            'message' => 'Cita médica actualizada exitosamente',
            'cita' => $citaActualizada
        ], 200);
    }

    public function destroy(Cita $cita, DeleteCitaAction $action): JsonResponse
    {
        Gate::authorize('delete', $cita);

        $action->execute($cita);

        return response()->json([
            'message' => 'Cita médica eliminada exitosamente'
        ], 200);
    }

    public function disponibilidad(Request $request, \App\Services\CitaValidationService $service): JsonResponse
    {
        Gate::authorize('viewAny', Cita::class);

        $request->validate([
            'doctor_id' => 'required|integer|exists:doctores,id',
            'sucursal_id' => 'required|integer|exists:sucursal,id',
            'fecha' => 'required|date',
            'hora_inicio' => 'nullable|string',
            'hora_fin' => 'nullable|string',
            'ignore_cita_id' => 'nullable|integer',
        ]);

        $sucursalId = (int) $request->query('sucursal_id');
        $user = $request->user();

        if ($user->rol && $user->rol->nombre === 'Doctor' && (int) $user->sucursal_id !== $sucursalId) {
            return response()->json([
                'message' => 'No autorizado para consultar disponibilidad en esta sucursal.'
            ], 403);
        }

        $res = $service->getDisponibilidadDoctor(
            (int) $request->query('doctor_id'),
            $sucursalId,
            (string) $request->query('fecha'),
            $request->query('hora_inicio') ? (string) $request->query('hora_inicio') : null,
            $request->query('hora_fin') ? (string) $request->query('hora_fin') : null,
            $request->query('ignore_cita_id') ? (int) $request->query('ignore_cita_id') : null
        );

        return response()->json($res, 200);
    }
}
