<?php

namespace App\Http\Controllers\Api;

use App\Actions\Antecedente\ShowAntecedenteAction;
use App\Actions\Antecedente\UpdateAntecedenteAction;
use App\Http\Controllers\Controller;
use App\Models\Paciente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AntecedenteController extends Controller
{
    public function show(Paciente $paciente, ShowAntecedenteAction $action): JsonResponse
    {
        $antecedente = $action->execute($paciente);

        return response()->json([
            'antecedente' => $antecedente
        ], 200);
    }

    public function update(Request $request, Paciente $paciente, UpdateAntecedenteAction $action): JsonResponse
    {
        $data = $request->validate([
            'tiene_diabetes' => ['nullable', 'boolean'],
            'descripcion_diabetes' => ['nullable', 'string'],
            'tiene_hipertencion' => ['nullable', 'boolean'],
            'descripcion_hipertencion' => ['nullable', 'string'],
            'tiene_cancer' => ['nullable', 'boolean'],
            'descripcion_cancer' => ['nullable', 'string'],
            'tiene_reumatismo' => ['nullable', 'boolean'],
            'descripcion_reumatismo' => ['nullable', 'string'],
            'tiene_alergias' => ['nullable', 'boolean'],
            'descripcion_alergias' => ['nullable', 'string'],
            'tiene_gastritis' => ['nullable', 'boolean'],
            'descripcion_gastritis' => ['nullable', 'string'],
            'otros' => ['nullable', 'string'],
            'esta_siendo_atendido_por_otro_doctor' => ['nullable', 'boolean'],
            'esta_tomando_algun_medicamento' => ['nullable', 'boolean'],
            'descripcion_medicamentos' => ['nullable', 'string'],
            'lo_han_intervenido_quirurgicamente' => ['nullable', 'boolean'],
            'descripcion_intervencion' => ['nullable', 'string'],
            'esta_embarazada' => ['nullable', 'boolean'],
            'descripcion_embarazo' => ['nullable', 'string'],
        ]);

        $antecedenteActualizado = $action->execute($paciente, $data);

        return response()->json([
            'message' => 'Antecedentes clínicos actualizados exitosamente',
            'antecedente' => $antecedenteActualizado
        ], 200);
    }
}
