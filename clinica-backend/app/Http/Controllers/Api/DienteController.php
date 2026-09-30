<?php

namespace App\Http\Controllers\Api;

use App\Actions\Diente\DeleteDienteAction;
use App\Actions\Diente\ListDientesAction;
use App\Actions\Diente\StoreDienteAction;
use App\Actions\Diente\UpdateDienteAction;
use App\DTOs\Diente\StoreDienteDTO;
use App\DTOs\Diente\UpdateDienteDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Diente\StoreDienteRequest;
use App\Http\Requests\Diente\UpdateDienteRequest;
use App\Models\Diente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DienteController extends Controller
{
    public function index(Request $request, ListDientesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Diente::class);

        $cuadrante = $request->query('cuadrante') ? (string) $request->query('cuadrante') : null;
        $tipoDenticion = $request->query('tipo_denticion') ? (string) $request->query('tipo_denticion') : null;
        $estado = $request->has('estado') ? filter_var($request->query('estado'), FILTER_VALIDATE_BOOLEAN) : null;

        $dientes = $action->execute($cuadrante, $tipoDenticion, $estado);

        return response()->json([
            'dientes' => $dientes
        ], 200);
    }

    public function store(StoreDienteRequest $request, StoreDienteAction $action): JsonResponse
    {
        Gate::authorize('create', Diente::class);

        $dto = StoreDienteDTO::fromRequest($request);
        $diente = $action->execute($dto);

        return response()->json([
            'message' => 'Pieza dental registrada exitosamente',
            'diente' => $diente
        ], 201);
    }

    public function show(Diente $diente): JsonResponse
    {
        Gate::authorize('view', $diente);

        return response()->json([
            'diente' => $diente
        ], 200);
    }

    public function update(UpdateDienteRequest $request, Diente $diente, UpdateDienteAction $action): JsonResponse
    {
        Gate::authorize('update', $diente);

        $dto = UpdateDienteDTO::fromRequest($request);
        $dienteActualizado = $action->execute($diente, $dto);

        return response()->json([
            'message' => 'Pieza dental actualizada exitosamente',
            'diente' => $dienteActualizado
        ], 200);
    }

    public function destroy(Diente $diente, DeleteDienteAction $action): JsonResponse
    {
        Gate::authorize('delete', $diente);

        $action->execute($diente);

        return response()->json([
            'message' => 'Pieza dental eliminada exitosamente'
        ], 200);
    }
}
