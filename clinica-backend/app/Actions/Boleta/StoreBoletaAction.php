<?php

namespace App\Actions\Boleta;

use App\DTOs\Boleta\StoreBoletaDTO;
use App\Models\BoletaServicioPrestado;
use App\Models\Cita;
use App\Models\DetalleServicioPrestado;
use App\Models\Cuota;
use Illuminate\Support\Facades\DB;

class StoreBoletaAction
{
    public function execute(StoreBoletaDTO $dto): BoletaServicioPrestado
    {
        return DB::transaction(function () use ($dto) {
            $cita = Cita::findOrFail($dto->cita_id);

            $doctorId = $dto->doctor_id ?: $cita->doctor_id;

            $montoComision = $dto->monto_comision_dr !== null
                ? $dto->monto_comision_dr
                : max(0, round(($dto->monto_total - $dto->costo_laboratorio) * ($dto->porcentaje_comision_dr / 100), 2));

            $isContado = ($dto->tipo_pago === 'Contado');
            $cantidadCuotas = $isContado ? 1 : max(1, $dto->cantidad_cuotas);

            // Determine initial boleta estado
            $estadoBoleta = $dto->estado;
            if ($isContado) {
                $estadoBoleta = 'completado';
            }

            $boleta = BoletaServicioPrestado::create([
                'cita_id' => $dto->cita_id,
                'doctor_id' => $doctorId,
                'fecha_emision' => $dto->fecha_emision,
                'numero_boleta' => $dto->numero_boleta,
                'emitido_por' => $dto->emitido_por,
                'monto_total' => $dto->monto_total,
                'tipo_pago' => $dto->tipo_pago,
                'cantidad_cuotas' => $cantidadCuotas,
                'porcentaje_comision_dr' => $dto->porcentaje_comision_dr,
                'costo_laboratorio' => $dto->costo_laboratorio,
                'monto_comision_dr' => $montoComision,
                'estado' => $estadoBoleta ?: ($isContado ? 'completado' : 'pendiente'),
            ]);

            // Save details items
            foreach ($dto->detalles as $detalle) {
                DetalleServicioPrestado::create([
                    'boleta_servicio_prestado_id' => $boleta->id,
                    'servicio_id' => $detalle['servicio_id'],
                    'diente_id' => isset($detalle['diente_id']) && $detalle['diente_id'] ? $detalle['diente_id'] : null,
                    'descripcion' => $detalle['descripcion'] ?? null,
                    'descuento' => isset($detalle['descuento']) ? (float) $detalle['descuento'] : 0,
                ]);
            }

            $totalPagado = 0;

            if ($isContado) {
                // Register single full payment cuota
                Cuota::create([
                    'boleta_servicio_prestado_id' => $boleta->id,
                    'numero_cuota' => 1,
                    'fecha_pago' => $dto->fecha_emision,
                    'modo_pago' => 'Pago Al Contado (100%)',
                    'monto_cuota' => $dto->monto_total,
                    'metodo_pago' => $dto->metodo_pago_contado ?? 'Efectivo',
                    'url_comprobante' => null,
                    'estado' => 'pagado',
                ]);
            } else {
                // Register cuotas for Crédito
                if (!empty($dto->cuotas)) {
                    $num = 1;
                    foreach ($dto->cuotas as $cuotaData) {
                        $montoC = (float) $cuotaData['monto_cuota'];
                        $stC = $cuotaData['estado'] ?? (isset($cuotaData['fecha_pago']) && $cuotaData['fecha_pago'] ? 'pagado' : 'pendiente');
                        if ($stC === 'pagado') {
                            $totalPagado += $montoC;
                        }

                        Cuota::create([
                            'boleta_servicio_prestado_id' => $boleta->id,
                            'numero_cuota' => $num++,
                            'fecha_pago' => $cuotaData['fecha_pago'] ?? date('Y-m-d'),
                            'modo_pago' => $cuotaData['modo_pago'] ?? ('Cuota ' . ($num - 1)),
                            'monto_cuota' => $montoC,
                            'metodo_pago' => $cuotaData['metodo_pago'] ?? 'Efectivo',
                            'url_comprobante' => $cuotaData['url_comprobante'] ?? null,
                            'estado' => $stC,
                        ]);
                    }

                    // Automatically generate remaining pending cuotas if balance remains
                    $saldoRestante = max(0, (float) $dto->monto_total - $totalPagado);
                    $cuotasCreadasCount = count($dto->cuotas);
                    $cuotasRestantesCount = max(1, $cantidadCuotas - $cuotasCreadasCount);

                    if ($saldoRestante > 0) {
                        $montoPorCuotaRestante = round($saldoRestante / $cuotasRestantesCount, 2);
                        for ($i = 1; $i <= $cuotasRestantesCount; $i++) {
                            $numCuotaActual = $cuotasCreadasCount + $i;
                            $fechaPago = date('Y-m-d', strtotime("+" . $i . " month"));

                            if ($i === $cuotasRestantesCount) {
                                $sumaActual = $totalPagado + ($montoPorCuotaRestante * ($cuotasRestantesCount - 1));
                                $montoCuotaActual = round($dto->monto_total - $sumaActual, 2);
                            } else {
                                $montoCuotaActual = $montoPorCuotaRestante;
                            }

                            Cuota::create([
                                'boleta_servicio_prestado_id' => $boleta->id,
                                'numero_cuota' => $numCuotaActual,
                                'fecha_pago' => $fechaPago,
                                'modo_pago' => 'Cuota ' . $numCuotaActual,
                                'monto_cuota' => max(0, $montoCuotaActual),
                                'metodo_pago' => 'Efectivo',
                                'url_comprobante' => null,
                                'estado' => 'pendiente',
                            ]);
                        }
                    }
                } else {
                    // Auto-generate installment schedule
                    $montoCuota = round($dto->monto_total / $cantidadCuotas, 2);
                    for ($i = 1; $i <= $cantidadCuotas; $i++) {
                        $fechaPago = date('Y-m-d', strtotime("+" . ($i - 1) . " month"));
                        Cuota::create([
                            'boleta_servicio_prestado_id' => $boleta->id,
                            'numero_cuota' => $i,
                            'fecha_pago' => $fechaPago,
                            'modo_pago' => 'Cuota ' . $i,
                            'monto_cuota' => $montoCuota,
                            'metodo_pago' => 'Efectivo',
                            'url_comprobante' => null,
                            'estado' => $i === 1 ? 'pagado' : 'pendiente',
                        ]);
                        if ($i === 1) {
                            $totalPagado += $montoCuota;
                        }
                    }
                }

                // Check if total paid reaches total amount to set completado
                if ($totalPagado >= $dto->monto_total) {
                    $boleta->update(['estado' => 'completado']);
                } else {
                    $boleta->update(['estado' => 'pendiente']);
                }
            }

            return $boleta->load([
                'cita.doctor.usuario',
                'cita.paciente',
                'cita.sucursal',
                'doctor.usuario',
                'detalles.servicio',
                'detalles.diente',
                'cuotas',
            ]);
        });
    }
}
