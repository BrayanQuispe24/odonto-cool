<?php

namespace App\Http\Controllers\Api;

use App\Actions\Proforma\CambiarEstadoProformaAction;
use App\Actions\Proforma\DeleteProformaAction;
use App\Actions\Proforma\ListProformasAction;
use App\Actions\Proforma\StoreProformaAction;
use App\DTOs\Proforma\StoreProformaDTO;
use App\Http\Controllers\Controller;
use App\Models\Proforma;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProformaController extends Controller
{
    public function index(Request $request, ListProformasAction $action): JsonResponse
    {
        Gate::authorize('viewAny', Proforma::class);
        $user = $request->user();
        $sucursalId = null;

        if ($user && $user->rol && $user->rol->nombre === 'Doctor') {
            $doctorSucursal = $user->sucursal_id ?? $user->doctor?->sucursal_id;
            // Si el doctor tiene sucursal, filtrar por ella; si no, evitar exponer otras sedes (-1)
            $sucursalId = $doctorSucursal ?: -1;
        } elseif ($request->query('sucursal_id') && $request->query('sucursal_id') !== 'all') {
            $sucursalId = (int) $request->query('sucursal_id');
        }

        $estado = $request->query('estado');
        $search = $request->query('search') ?: $request->query('q');
        $doctorId = $request->query('doctor_id') ? (int) $request->query('doctor_id') : null;
        $fechaDesde = $request->query('fecha_desde');
        $fechaHasta = $request->query('fecha_hasta');

        $perPage = $request->query('per_page') ? (int) $request->query('per_page') : null;

        $result = $action->execute(
            $sucursalId,
            $estado,
            $search,
            $doctorId,
            $fechaDesde,
            $fechaHasta,
            $perPage
        );

        if ($result instanceof \Illuminate\Contracts\Pagination\LengthAwarePaginator) {
            return response()->json([
                'proformas' => $result->items(),
                'pagination' => [
                    'total' => $result->total(),
                    'per_page' => $result->perPage(),
                    'current_page' => $result->currentPage(),
                    'last_page' => $result->lastPage(),
                ],
            ], 200);
        }

        return response()->json([
            'proformas' => $result,
        ], 200);
    }

    public function store(Request $request, StoreProformaAction $action): JsonResponse
    {
        Gate::authorize('create', Proforma::class);

        $user = $request->user();

        $request->validate([
            'sucursal_id' => 'required|integer|exists:sucursal,id',
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'edad' => 'required|integer|min:0|max:120',
            'sexo' => 'required|string|in:M,F,Otro',
            'celular' => 'required|string|max:30',
            'fecha_emision' => 'required|date',
            'dias_validez' => 'nullable|integer|min:1',
            'paciente_id' => 'nullable|integer|exists:pacientes,id',
            'doctor_id' => 'nullable|integer|exists:doctores,id',
            'fecha_nacimiento' => 'nullable|date',
            'domicilio_actual' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.servicio_id' => 'required|integer|exists:servicios,id',
            'detalles.*.nombre_servicio' => 'nullable|string|max:150',
            'detalles.*.precio' => 'required|numeric|min:0',
            'detalles.*.descuento' => 'nullable|numeric|min:0',
        ]);

        $data = $request->all();

        // Para el rol Doctor, forzar la sucursal asignada al doctor
        if ($user && $user->rol && $user->rol->nombre === 'Doctor') {
            $doctorSucursal = $user->sucursal_id ?? $user->doctor?->sucursal_id;
            if ($doctorSucursal) {
                $data['sucursal_id'] = $doctorSucursal;
            }
        }

        $dto = StoreProformaDTO::fromArray($data);
        $proforma = $action->execute($dto);

        return response()->json([
            'message' => 'Proforma / Presupuesto registrado exitosamente en estado Borrador',
            'proforma' => $proforma,
        ], 201);
    }

    public function show(Request $request, Proforma $proforma): JsonResponse
    {
        Gate::authorize('view', $proforma);
        $this->checkDoctorSucursalPermission($request->user(), $proforma);

        $proformaCargada = $proforma->load([
            'paciente',
            'doctor.usuario',
            'sucursal',
            'detalles.servicio',
        ]);

        return response()->json([
            'proforma' => $proformaCargada,
        ], 200);
    }

    public function cambiarEstado(Request $request, Proforma $proforma, CambiarEstadoProformaAction $action): JsonResponse
    {
        Gate::authorize('update', $proforma);
        $this->checkDoctorSucursalPermission($request->user(), $proforma);

        $request->validate([
            'estado' => 'required|string|in:Borrador,Aprobado,Rechazado',
            'paciente_id' => 'nullable|integer|exists:pacientes,id',
            'registrar_nuevo_paciente' => 'nullable|boolean',
            'datos_paciente_extra' => 'nullable|array',
        ]);

        $nuevoEstado = (string) $request->input('estado');
        $pacienteId = $request->input('paciente_id') ? (int) $request->input('paciente_id') : null;
        $registrarNuevoPaciente = (bool) $request->input('registrar_nuevo_paciente', false);
        $datosPacienteExtra = (array) $request->input('datos_paciente_extra', []);

        $proformaActualizada = $action->execute(
            $proforma,
            $nuevoEstado,
            $pacienteId,
            $registrarNuevoPaciente,
            $datosPacienteExtra
        );

        return response()->json([
            'message' => "Estado de la proforma actualizado a {$nuevoEstado} correctamente",
            'proforma' => $proformaActualizada,
        ], 200);
    }

    public function destroy(Request $request, Proforma $proforma, DeleteProformaAction $action): JsonResponse
    {
        Gate::authorize('delete', $proforma);
        $this->checkDoctorSucursalPermission($request->user(), $proforma);

        $action->execute($proforma);

        return response()->json([
            'message' => 'Proforma eliminada exitosamente',
        ], 200);
    }

    private function checkDoctorSucursalPermission($user, Proforma $proforma): void
    {
        if ($user && $user->rol && $user->rol->nombre === 'Doctor') {
            $doctorSucursalId = $user->sucursal_id ?? $user->doctor?->sucursal_id;
            if ($doctorSucursalId && $proforma->sucursal_id !== $doctorSucursalId) {
                abort(403, 'Acceso denegado: no tiene permisos para gestionar proformas de otra sucursal.');
            }
        }
    }
}
