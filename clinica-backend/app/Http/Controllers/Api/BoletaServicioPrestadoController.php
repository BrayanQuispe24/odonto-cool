<?php

namespace App\Http\Controllers\Api;

use App\Actions\Boleta\DeleteBoletaAction;
use App\Actions\Boleta\ListBoletasAction;
use App\Actions\Boleta\ShowBoletaAction;
use App\Actions\Boleta\StoreBoletaAction;
use App\DTOs\Boleta\StoreBoletaDTO;
use App\Http\Controllers\Controller;
use App\Models\BoletaServicioPrestado;
use App\Models\Cuota;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BoletaServicioPrestadoController extends Controller
{
    public function index(Request $request, ListBoletasAction $action): JsonResponse
    {
        $citaId = $request->query('cita_id') ? (int) $request->query('cita_id') : null;
        $doctorId = $request->query('doctor_id') ? (int) $request->query('doctor_id') : null;
        $pacienteId = $request->query('paciente_id') ? (int) $request->query('paciente_id') : null;
        $estado = $request->query('estado') ? (string) $request->query('estado') : null;
        $user = $request->user();
        $sucursalId = null;
        if ($user && $user->rol && $user->rol->nombre === 'Doctor') {
            $sucursalId = $user->sucursal_id;
        }

        $boletas = $action->execute($citaId, $doctorId, $pacienteId, $estado, $sucursalId);

        return response()->json([
            'boletas' => $boletas
        ], 200);
    }

    public function store(Request $request, StoreBoletaAction $action): JsonResponse
    {
        $request->validate([
            'cita_id' => 'required|integer|exists:citas,id',
            'doctor_id' => 'nullable|integer|exists:doctores,id',
            'monto_total' => 'required|numeric|min:0',
            'tipo_paga' => 'nullable|string',
            'tipo_pago' => 'nullable|string',
            'cantidad_cuotas' => 'nullable|integer|min:1',
            'metodo_pago' => 'nullable|string',
            'porcentaje_comision_dr' => 'nullable|numeric|min:0|max:100',
            'monto_comision_dr' => 'nullable|numeric|min:0',
            'costo_laboratorio' => 'nullable|numeric|min:0',
            'estado' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.servicio_id' => 'required|integer|exists:servicios,id',
            'detalles.*.diente_id' => 'nullable|integer|exists:dientes,id',
            'detalles.*.descripcion' => 'nullable|string',
            'detalles.*.descuento' => 'nullable|numeric|min:0',
            'cuotas' => 'nullable|array',
        ]);

        $dto = StoreBoletaDTO::fromArray($request->all());
        $boleta = $action->execute($dto);

        return response()->json([
            'message' => 'Boleta de venta de servicios prestados registrada exitosamente',
            'boleta' => $boleta
        ], 201);
    }

    public function show(BoletaServicioPrestado $boleta, ShowBoletaAction $action): JsonResponse
    {
        $boletaDetalle = $action->execute($boleta);

        return response()->json([
            'boleta' => $boletaDetalle
        ], 200);
    }

    public function update(Request $request, BoletaServicioPrestado $boleta): JsonResponse
    {
        $request->validate([
            'estado' => 'nullable|string',
            'metodo_pago' => 'nullable|string',
            'url_comprobante' => 'nullable|string',
        ]);

        $boleta->update($request->only(['estado', 'metodo_pago', 'url_comprobante']));

        return response()->json([
            'message' => 'Boleta de servicio prestado actualizada exitosamente',
            'boleta' => $boleta->fresh(['cita.doctor.usuario', 'cita.paciente', 'cita.sucursal', 'doctor.usuario', 'detalles.servicio', 'detalles.diente', 'cuotas'])
        ], 200);
    }

    public function destroy(BoletaServicioPrestado $boleta, DeleteBoletaAction $action): JsonResponse
    {
        $action->execute($boleta);

        return response()->json([
            'message' => 'Boleta de servicio prestado eliminada exitosamente'
        ], 200);
    }

    public function pagarCuota(Request $request, BoletaServicioPrestado $boleta, Cuota $cuota): JsonResponse
    {
        if ($error = $this->checkCanModifyCuotas($request, $boleta)) {
            return $error;
        }

        $request->validate([
            'fecha_pago' => 'nullable|date',
            'metodo_pago' => 'nullable|string',
            'url_comprobante' => 'nullable|string',
        ]);

        $cuota->update([
            'fecha_pago' => $request->input('fecha_pago') ?? date('Y-m-d'),
            'metodo_pago' => $request->input('metodo_pago') ?? ($cuota->metodo_pago ?? 'Efectivo'),
            'url_comprobante' => $request->input('url_comprobante') ?? $cuota->url_comprobante,
            'estado' => 'pagado',
        ]);

        $this->recalcularEstadoBoleta($boleta);

        return response()->json([
            'message' => 'Cuota registrada como pagada exitosamente',
            'boleta' => $boleta->fresh(['cita.doctor.usuario', 'cita.paciente', 'cita.sucursal', 'doctor.usuario', 'detalles.servicio', 'detalles.diente', 'cuotas'])
        ], 200);
    }

    public function storeCuota(Request $request, BoletaServicioPrestado $boleta): JsonResponse
    {
        if ($error = $this->checkCanModifyCuotas($request, $boleta)) {
            return $error;
        }

        $request->validate([
            'monto_cuota' => 'required|numeric|min:0.01',
            'fecha_pago' => 'nullable|date',
            'modo_pago' => 'nullable|string',
            'metodo_pago' => 'nullable|string',
            'url_comprobante' => 'nullable|string',
            'estado' => 'nullable|string|in:pendiente,pagado',
        ]);

        $maxNumero = (int) $boleta->cuotas()->max('numero_cuota');
        $nuevoNumero = $maxNumero + 1;

        $boleta->cuotas()->create([
            'numero_cuota' => $nuevoNumero,
            'monto_cuota' => $request->input('monto_cuota'),
            'fecha_pago' => $request->input('fecha_pago') ?? date('Y-m-d'),
            'modo_pago' => $request->input('modo_pago') ?? ('Cuota ' . $nuevoNumero),
            'metodo_pago' => $request->input('metodo_pago') ?? 'Efectivo',
            'url_comprobante' => $request->input('url_comprobante'),
            'estado' => $request->input('estado') ?? 'pendiente',
        ]);

        $this->recalcularEstadoBoleta($boleta);

        return response()->json([
            'message' => 'Cuota agregada exitosamente',
            'boleta' => $boleta->fresh(['cita.doctor.usuario', 'cita.paciente', 'cita.sucursal', 'doctor.usuario', 'detalles.servicio', 'detalles.diente', 'cuotas'])
        ], 201);
    }

    public function updateCuota(Request $request, BoletaServicioPrestado $boleta, Cuota $cuota): JsonResponse
    {
        if ($error = $this->checkCanModifyCuotas($request, $boleta)) {
            return $error;
        }

        if ($cuota->boleta_servicio_prestado_id !== $boleta->id) {
            return response()->json(['message' => 'La cuota no pertenece a esta boleta'], 422);
        }

        $request->validate([
            'monto_cuota' => 'sometimes|required|numeric|min:0.01',
            'fecha_pago' => 'nullable|date',
            'modo_pago' => 'nullable|string',
            'metodo_pago' => 'nullable|string',
            'url_comprobante' => 'nullable|string',
            'estado' => 'nullable|string|in:pendiente,pagado',
        ]);

        $cuota->update($request->only([
            'monto_cuota',
            'fecha_pago',
            'modo_pago',
            'metodo_pago',
            'url_comprobante',
            'estado',
        ]));

        $this->recalcularEstadoBoleta($boleta);

        return response()->json([
            'message' => 'Cuota actualizada exitosamente',
            'boleta' => $boleta->fresh(['cita.doctor.usuario', 'cita.paciente', 'cita.sucursal', 'doctor.usuario', 'detalles.servicio', 'detalles.diente', 'cuotas'])
        ], 200);
    }

    public function destroyCuota(Request $request, BoletaServicioPrestado $boleta, Cuota $cuota): JsonResponse
    {
        if ($error = $this->checkCanModifyCuotas($request, $boleta)) {
            return $error;
        }

        if ($cuota->boleta_servicio_prestado_id !== $boleta->id) {
            return response()->json(['message' => 'La cuota no pertenece a esta boleta'], 422);
        }

        $cuota->delete();

        $remainingCuotas = $boleta->cuotas()->orderBy('id', 'asc')->get();
        $i = 1;
        foreach ($remainingCuotas as $c) {
            $c->update(['numero_cuota' => $i++]);
        }

        $this->recalcularEstadoBoleta($boleta);

        return response()->json([
            'message' => 'Cuota eliminada exitosamente',
            'boleta' => $boleta->fresh(['cita.doctor.usuario', 'cita.paciente', 'cita.sucursal', 'doctor.usuario', 'detalles.servicio', 'detalles.diente', 'cuotas'])
        ], 200);
    }

    private function checkCanModifyCuotas(Request $request, BoletaServicioPrestado $boleta): ?JsonResponse
    {
        if ($boleta->estado === 'completado') {
            $user = $request->user();
            $roleName = ($user && $user->rol) ? strtolower($user->rol->nombre) : '';
            $isAdmin = in_array($roleName, ['administrador', 'admin']);

            if (!$isAdmin) {
                return response()->json([
                    'message' => 'La boleta se encuentra en estado COMPLETADO. Solo un Administrador puede modificar o agregar cuotas.'
                ], 403);
            }
        }
        return null;
    }

    private function recalcularEstadoBoleta(BoletaServicioPrestado $boleta): void
    {
        $totalCuotas = $boleta->cuotas()->count();
        $totalPagado = (float) $boleta->cuotas()->where('estado', 'pagado')->sum('monto_cuota');

        $nuevoEstado = $totalPagado >= (float) $boleta->monto_total ? 'completado' : 'pendiente';

        $boleta->update([
            'cantidad_cuotas' => max(1, $totalCuotas),
            'estado' => $nuevoEstado,
        ]);
    }
}
