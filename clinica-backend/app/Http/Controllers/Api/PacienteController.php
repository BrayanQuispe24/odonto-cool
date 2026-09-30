<?php

namespace App\Http\Controllers\Api;

use App\Actions\Paciente\DeletePacienteAction;
use App\Actions\Paciente\ListPacientesAction;
use App\Actions\Paciente\ShowPacienteAction;
use App\Actions\Paciente\StorePacienteAction;
use App\Actions\Paciente\UpdatePacienteAction;
use App\DTOs\Paciente\StorePacienteDTO;
use App\DTOs\Paciente\UpdatePacienteDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Paciente\StorePacienteRequest;
use App\Http\Requests\Paciente\UpdatePacienteRequest;
use App\Models\Paciente;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PacienteController extends Controller
{
    public function index(ListPacientesAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Paciente::class);

        $pacientes = $action->execute();

        return response()->json([
            'pacientes' => $pacientes
        ], 200);
    }

    public function store(StorePacienteRequest $request, StorePacienteAction $action): JsonResponse
    {
        Gate::authorize('create', Paciente::class);

        $dto = StorePacienteDTO::fromRequest($request);
        $paciente = $action->execute($dto);

        return response()->json([
            'message' => 'Paciente registrado exitosamente',
            'paciente' => $paciente
        ], 201);
    }

    public function show(Paciente $paciente, ShowPacienteAction $action): JsonResponse
    {
        Gate::authorize('view', $paciente);

        $pacienteCargado = $action->execute($paciente);

        return response()->json([
            'paciente' => $pacienteCargado
        ], 200);
    }

    public function update(UpdatePacienteRequest $request, Paciente $paciente, UpdatePacienteAction $action): JsonResponse
    {
        Gate::authorize('update', $paciente);

        $dto = UpdatePacienteDTO::fromRequest($request);
        $pacienteActualizado = $action->execute($paciente, $dto);

        return response()->json([
            'message' => 'Paciente actualizado exitosamente',
            'paciente' => $pacienteActualizado
        ], 200);
    }

    public function destroy(Paciente $paciente, DeletePacienteAction $action): JsonResponse
    {
        Gate::authorize('delete', $paciente);

        $action->execute($paciente);

        return response()->json([
            'message' => 'Paciente eliminado exitosamente'
        ], 200);
    }
}
