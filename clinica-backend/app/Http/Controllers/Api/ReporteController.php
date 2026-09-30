<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BoletaServicioPrestado;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    /**
     * Reporte Financiero y Operativo Global de la Clínica
     */
    public function financiero(Request $request): JsonResponse
    {
        $fechaInicio = $request->query('fecha_inicio');
        $fechaFin = $request->query('fecha_fin');
        $sucursalId = $request->query('sucursal_id') ? (int) $request->query('sucursal_id') : null;
        $doctorId = $request->query('doctor_id') ? (int) $request->query('doctor_id') : null;
        $tipoPago = $request->query('tipo_pago');
        $metodoPago = $request->query('metodo_pago');
        $estado = $request->query('estado');

        $query = BoletaServicioPrestado::with([
            'cita.doctor.usuario',
            'cita.paciente',
            'cita.sucursal',
            'doctor.usuario',
            'detalles.servicio',
            'detalles.diente',
            'cuotas'
        ]);

        if ($fechaInicio) {
            $query->whereDate('fecha_emision', '>=', $fechaInicio);
        }

        if ($fechaFin) {
            $query->whereDate('fecha_emision', '<=', $fechaFin);
        }

        if ($sucursalId) {
            $query->whereHas('cita', function ($q) use ($sucursalId) {
                $q->where('sucursal_id', $sucursalId);
            });
        }

        if ($doctorId) {
            $query->where(function ($q) use ($doctorId) {
                $q->where('doctor_id', $doctorId)
                  ->orWhereHas('cita', function ($cq) use ($doctorId) {
                      $cq->where('doctor_id', $doctorId);
                  });
            });
        }

        if ($tipoPago) {
            $tpLower = strtolower(trim($tipoPago));
            if (in_array($tpLower, ['credito', 'cuotas', 'al credito'])) {
                $query->where(function ($q) {
                    $q->whereRaw('LOWER(tipo_pago) LIKE ?', ['%credito%'])
                      ->orWhereRaw('LOWER(tipo_pago) LIKE ?', ['%cuota%']);
                });
            } elseif (in_array($tpLower, ['contado', 'al contado'])) {
                $query->where(function ($q) {
                    $q->whereRaw('LOWER(tipo_pago) LIKE ?', ['%contado%']);
                });
            } else {
                $query->whereRaw('LOWER(tipo_pago) = ?', [$tpLower]);
            }
        }

        if ($estado) {
            $estLower = strtolower(trim($estado));
            $query->whereRaw('LOWER(estado) = ?', [$estLower]);
        }

        if ($metodoPago) {
            $mpLower = strtolower(trim($metodoPago));
            $query->whereHas('cuotas', function ($q) use ($mpLower) {
                $q->whereRaw('LOWER(metodo_pago) LIKE ?', ['%' . $mpLower . '%']);
            });
        }

        $boletas = $query->orderBy('fecha_emision', 'desc')->get();

        // 1. Calcular Totales Generales
        $totalBoletas = $boletas->count();
        $montoTotalGenerado = 0;
        $montoTotalCobrado = 0;
        $montoComisionesDr = 0;
        $montoCostoLaboratorio = 0;
        $boletasCompletadas = 0;
        $boletasPendientes = 0;

        // Desgloses
        $doctoresMap = [];
        $sucursalesMap = [];
        $metodosPagoMap = [];
        $tiposPagoMap = [];

        foreach ($boletas as $boleta) {
            $montoGenerado = (float) $boleta->monto_total;
            $comision = (float) $boleta->monto_comision_dr;
            $costoLab = (float) $boleta->costo_laboratorio;

            $montoTotalGenerado += $montoGenerado;
            $montoComisionesDr += $comision;
            $montoCostoLaboratorio += $costoLab;

            $estadoBoletaLower = strtolower((string) $boleta->estado);
            if (in_array($estadoBoletaLower, ['completado', 'pagada', 'pagado'])) {
                $boletasCompletadas++;
            } else {
                $boletasPendientes++;
            }

            // Suma de cuotas pagadas
            $cobradoBoleta = 0;
            foreach ($boleta->cuotas as $cuota) {
                if (strtolower((string) $cuota->estado) === 'pagado') {
                    $montoCuota = (float) $cuota->monto_cuota;
                    $cobradoBoleta += $montoCuota;

                    // Desglose por método de pago (solo cuotas pagadas)
                    $metodo = strtolower(trim((string) ($cuota->metodo_pago ?: 'efectivo')));
                    if (!isset($metodosPagoMap[$metodo])) {
                        $metodosPagoMap[$metodo] = [
                            'metodo_pago' => $metodo,
                            'monto_total' => 0,
                            'cantidad_transacciones' => 0
                        ];
                    }
                    $metodosPagoMap[$metodo]['monto_total'] += $montoCuota;
                    $metodosPagoMap[$metodo]['cantidad_transacciones']++;
                }
            }
            $montoTotalCobrado += $cobradoBoleta;

            // Desglose por Tipo de Pago
            $rawTp = strtolower(trim((string) ($boleta->tipo_pago ?: 'contado')));
            $tPagoKey = (str_contains($rawTp, 'credito') || str_contains($rawTp, 'cuota')) ? 'credito' : 'contado';
            if (!isset($tiposPagoMap[$tPagoKey])) {
                $tiposPagoMap[$tPagoKey] = [
                    'tipo_pago' => $tPagoKey,
                    'monto_total' => 0,
                    'cantidad_boletas' => 0
                ];
            }
            $tiposPagoMap[$tPagoKey]['monto_total'] += $montoGenerado;
            $tiposPagoMap[$tPagoKey]['cantidad_boletas']++;

            // Desglose por Doctor
            $doc = $boleta->doctor ?: ($boleta->cita->doctor ?? null);
            $docId = $doc ? $doc->id : 0;
            $nombreDoc = 'Sin asignar';
            $especialidad = 'N/A';

            if ($doc) {
                $nombreDoc = trim(($doc->nombre ?? '') . ' ' . ($doc->apellido ?? ''));
                if (empty($nombreDoc) && $doc->usuario) {
                    $nombreDoc = $doc->usuario->name;
                }
                if (!empty($doc->especialidades) && is_array($doc->especialidades)) {
                    $especialidad = implode(', ', $doc->especialidades);
                }
            }

            if (!isset($doctoresMap[$docId])) {
                $doctoresMap[$docId] = [
                    'doctor_id' => $docId,
                    'nombre_doctor' => $nombreDoc,
                    'especialidad' => $especialidad,
                    'total_boletas' => 0,
                    'monto_total_generado' => 0,
                    'monto_total_cobrado' => 0,
                    'monto_total_pendiente' => 0,
                    'comisiones_totales' => 0,
                ];
            }
            $doctoresMap[$docId]['total_boletas']++;
            $doctoresMap[$docId]['monto_total_generado'] += $montoGenerado;
            $doctoresMap[$docId]['monto_total_cobrado'] += $cobradoBoleta;
            $doctoresMap[$docId]['monto_total_pendiente'] += max(0, $montoGenerado - $cobradoBoleta);
            $doctoresMap[$docId]['comisiones_totales'] += $comision;

            // Desglose por Sucursal
            $sucursal = $boleta->cita->sucursal ?? null;
            $sucId = $sucursal ? $sucursal->id : 0;
            $nombreSuc = $sucursal ? $sucursal->nombre : 'Sucursal General';

            if (!isset($sucursalesMap[$sucId])) {
                $sucursalesMap[$sucId] = [
                    'sucursal_id' => $sucId,
                    'nombre_sucursal' => $nombreSuc,
                    'total_boletas' => 0,
                    'monto_total_generado' => 0,
                    'monto_total_cobrado' => 0,
                ];
            }
            $sucursalesMap[$sucId]['total_boletas']++;
            $sucursalesMap[$sucId]['monto_total_generado'] += $montoGenerado;
            $sucursalesMap[$sucId]['monto_total_cobrado'] += $cobradoBoleta;
        }

        $montoTotalPendiente = max(0, $montoTotalGenerado - $montoTotalCobrado);
        $gananciaNetaEstimada = $montoTotalCobrado - $montoComisionesDr - $montoCostoLaboratorio;

        return response()->json([
            'resumen' => [
                'total_boletas' => $totalBoletas,
                'monto_total_generado' => round($montoTotalGenerado, 2),
                'monto_total_cobrado' => round($montoTotalCobrado, 2),
                'monto_total_pendiente' => round($montoTotalPendiente, 2),
                'monto_comisiones_dr' => round($montoComisionesDr, 2),
                'monto_costo_laboratorio' => round($montoCostoLaboratorio, 2),
                'ganancia_neta_estimada' => round($gananciaNetaEstimada, 2),
                'boletas_completadas' => $boletasCompletadas,
                'boletas_pendientes' => $boletasPendientes,
            ],
            'desglose_doctores' => array_values($doctoresMap),
            'desglose_sucursales' => array_values($sucursalesMap),
            'desglose_metodos_pago' => array_values($metodosPagoMap),
            'desglose_tipos_pago' => array_values($tiposPagoMap),
            'boletas' => $boletas,
        ], 200);
    }
}
