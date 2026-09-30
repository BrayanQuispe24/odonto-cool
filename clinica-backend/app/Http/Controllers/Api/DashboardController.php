<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BoletaServicioPrestado;
use App\Models\Cita;
use App\Models\Cuota;
use App\Models\Doctor;
use App\Models\Paciente;
use App\Models\Sucursal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Dashboard para Administrador (Visión global del sistema)
     */
    public function adminStats(Request $request): JsonResponse
    {
        $currentMonth = date('m');
        $currentYear = date('Y');
        $today = date('Y-m-d');

        // Total facturado mes actual
        $ventasMes = BoletaServicioPrestado::whereMonth('fecha_emision', $currentMonth)
            ->whereYear('fecha_emision', $currentYear)
            ->sum('monto_total');

        // Total cobrado mes actual
        $cobradoMes = Cuota::where('estado', 'pagado')
            ->whereMonth('fecha_pago', $currentMonth)
            ->whereYear('fecha_pago', $currentYear)
            ->sum('monto_cuota');

        // Total pacientes del sistema
        $totalPacientes = Paciente::count();

        // Citas programadas para hoy
        $citasHoy = Cita::whereDate('fecha', $today)->count();

        // Boletas completadas vs pendientes
        $boletasCompletadas = BoletaServicioPrestado::whereRaw('LOWER(estado) IN (?, ?)', ['completado', 'pagada'])->count();
        $boletasPendientes = BoletaServicioPrestado::whereRaw('LOWER(estado) NOT IN (?, ?)', ['completado', 'pagada'])->count();

        // Ventas por Sucursal
        $sucursales = Sucursal::withCount('citas')->get();
        $ventasSucursales = [];
        foreach ($sucursales as $sucursal) {
            $totalGenerado = BoletaServicioPrestado::whereHas('cita', function ($q) use ($sucursal) {
                $q->where('sucursal_id', $sucursal->id);
            })->sum('monto_total');

            $ventasSucursales[] = [
                'id' => $sucursal->id,
                'nombre' => $sucursal->nombre,
                'total_generado' => round((float) $totalGenerado, 2),
                'citas_count' => $sucursal->citas_count,
            ];
        }

        // Histórico de ventas últimos 6 meses (para gráficos)
        $graficoVentas = [];
        for ($i = 5; $i >= 0; $i--) {
            $time = strtotime("-$i months");
            $m = date('m', $time);
            $y = date('Y', $time);
            $nombreMes = date('M', $time);

            $monto = BoletaServicioPrestado::whereMonth('fecha_emision', $m)
                ->whereYear('fecha_emision', $y)
                ->sum('monto_total');

            $graficoVentas[] = [
                'mes' => $nombreMes,
                'ano' => $y,
                'total' => round((float) $monto, 2),
            ];
        }

        // Citas de hoy con pacientes
        $citasHoyList = Cita::with(['paciente', 'doctor', 'sucursal'])
            ->whereDate('fecha', $today)
            ->orderBy('hora_inicio', 'asc')
            ->take(6)
            ->get();

        return response()->json([
            'ventas_mes' => round((float) $ventasMes, 2),
            'cobrado_mes' => round((float) $cobradoMes, 2),
            'total_pacientes' => $totalPacientes,
            'citas_hoy_count' => $citasHoy,
            'boletas_completadas' => $boletasCompletadas,
            'boletas_pendientes' => $boletasPendientes,
            'ventas_sucursales' => $ventasSucursales,
            'grafico_ventas' => $graficoVentas,
            'citas_hoy' => $citasHoyList,
        ], 200);
    }

    /**
     * Dashboard para Doctor (Gestión personal clínica y de sus boletas/citas)
     */
    public function doctorStats(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentMonth = date('m');
        $currentYear = date('Y');
        $today = date('Y-m-d');

        // Buscar médico asociado al usuario autenticado
        $doctor = null;
        if ($user) {
            $doctor = Doctor::where('usuario_id', $user->id)->first();
        }
        if (!$doctor && $request->query('doctor_id')) {
            $doctor = Doctor::find((int) $request->query('doctor_id'));
        }

        $doctorId = $doctor ? $doctor->id : null;

        if (!$doctorId) {
            // Si el usuario no tiene doctor asignado, tomar el primero para visualización
            $doctor = Doctor::first();
            $doctorId = $doctor ? $doctor->id : null;
        }

        if (!$doctorId) {
            return response()->json([
                'doctor' => null,
                'mis_ventas_mes' => 0,
                'mis_comisiones_mes' => 0,
                'mis_citas_hoy_count' => 0,
                'mis_pacientes_count' => 0,
                'citas_hoy' => [],
                'ultimas_boletas' => [],
            ], 200);
        }

        // Query base de boletas del doctor
        $boletasQuery = BoletaServicioPrestado::where(function ($q) use ($doctorId) {
            $q->where('doctor_id', $doctorId)
              ->orWhereHas('cita', function ($cq) use ($doctorId) {
                  $cq->where('doctor_id', $doctorId);
              });
        });

        // Ventas del doctor este mes
        $misVentasMes = (clone $boletasQuery)
            ->whereMonth('fecha_emision', $currentMonth)
            ->whereYear('fecha_emision', $currentYear)
            ->sum('monto_total');

        // Comisiones del doctor este mes
        $misComisionesMes = (clone $boletasQuery)
            ->whereMonth('fecha_emision', $currentMonth)
            ->whereYear('fecha_emision', $currentYear)
            ->sum('monto_comision_dr');

        // Citas del doctor hoy
        $citasHoyList = Cita::with(['paciente', 'sucursal'])
            ->where('doctor_id', $doctorId)
            ->whereDate('fecha', $today)
            ->orderBy('hora_inicio', 'asc')
            ->get();

        $citasHoyCount = $citasHoyList->count();

        // Pacientes únicos atendidos por el doctor
        $misPacientesCount = Cita::where('doctor_id', $doctorId)
            ->distinct('paciente_id')
            ->count('paciente_id');

        // Últimas 5 boletas emitidas por el doctor
        $ultimasBoletas = (clone $boletasQuery)
            ->with(['cita.paciente', 'cuotas'])
            ->orderBy('fecha_emision', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'doctor' => [
                'id' => $doctor->id,
                'nombre' => $doctor->nombre . ' ' . $doctor->apellido,
                'especialidad' => is_array($doctor->especialidades) ? implode(', ', $doctor->especialidades) : 'Odontólogo',
            ],
            'mis_ventas_mes' => round((float) $misVentasMes, 2),
            'mis_comisiones_mes' => round((float) $misComisionesMes, 2),
            'mis_citas_hoy_count' => $citasHoyCount,
            'mis_pacientes_count' => $misPacientesCount,
            'citas_hoy' => $citasHoyList,
            'ultimas_boletas' => $ultimasBoletas,
        ], 200);
    }
}
