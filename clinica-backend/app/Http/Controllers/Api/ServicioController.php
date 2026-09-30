<?php

namespace App\Http\Controllers\Api;

use App\Actions\Servicio\DeleteServicioAction;
use App\Actions\Servicio\ListServiciosAction;
use App\Actions\Servicio\StoreServicioAction;
use App\Actions\Servicio\UpdateServicioAction;
use App\DTOs\Servicio\StoreServicioDTO;
use App\DTOs\Servicio\UpdateServicioDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Servicio\StoreServicioRequest;
use App\Http\Requests\Servicio\UpdateServicioRequest;
use App\Models\Servicio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ServicioController extends Controller
{
    public function index(Request $request, ListServiciosAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Servicio::class);

        $categoria = $request->query('categoria') ? (string) $request->query('categoria') : null;
        $estado = $request->has('estado') ? filter_var($request->query('estado'), FILTER_VALIDATE_BOOLEAN) : null;

        $servicios = $action->execute($categoria, $estado);

        return response()->json([
            'servicios' => $servicios
        ], 200);
    }

    public function store(StoreServicioRequest $request, StoreServicioAction $action): JsonResponse
    {
        Gate::authorize('create', Servicio::class);

        $dto = StoreServicioDTO::fromRequest($request);
        $servicio = $action->execute($dto);

        return response()->json([
            'message' => 'Servicio dental registrado exitosamente',
            'servicio' => $servicio
        ], 201);
    }

    public function show(Servicio $servicio): JsonResponse
    {
        Gate::authorize('view', $servicio);

        return response()->json([
            'servicio' => $servicio
        ], 200);
    }

    public function update(UpdateServicioRequest $request, Servicio $servicio, UpdateServicioAction $action): JsonResponse
    {
        Gate::authorize('update', $servicio);

        $dto = UpdateServicioDTO::fromRequest($request);
        $servicioActualizado = $action->execute($servicio, $dto);

        return response()->json([
            'message' => 'Servicio dental actualizado exitosamente',
            'servicio' => $servicioActualizado
        ], 200);
    }

    public function destroy(Servicio $servicio, DeleteServicioAction $action): JsonResponse
    {
        Gate::authorize('delete', $servicio);

        $action->execute($servicio);

        return response()->json([
            'message' => 'Servicio dental eliminado exitosamente'
        ], 200);
    }
}
