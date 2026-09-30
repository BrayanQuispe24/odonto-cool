<?php

namespace App\DTOs\Boleta;

class StoreBoletaDTO
{
    public function __construct(
        public int $cita_id,
        public ?int $doctor_id,
        public string $fecha_emision,
        public string $numero_boleta,
        public string $emitido_por,
        public float $monto_total,
        public string $tipo_pago,
        public int $cantidad_cuotas,
        public float $porcentaje_comision_dr,
        public float $costo_laboratorio,
        public ?float $monto_comision_dr,
        public ?string $metodo_pago_contado,
        public ?string $estado,
        public array $detalles,
        public array $cuotas = []
    ) {}

    public static function fromArray(array $data): self
    {
        $rawTipoPago = $data['tipo_pago'] ?? ($data['tipo_paga'] ?? 'Contado');
        $normTipoPago = (strcasecmp($rawTipoPago, 'Credito') === 0 || strcasecmp($rawTipoPago, 'Cuotas') === 0 || strcasecmp($rawTipoPago, 'Al Credito') === 0)
            ? 'Credito'
            : 'Contado';

        return new self(
            cita_id: (int) $data['cita_id'],
            doctor_id: isset($data['doctor_id']) && $data['doctor_id'] ? (int) $data['doctor_id'] : null,
            fecha_emision: $data['fecha_emision'] ?? date('Y-m-d'),
            numero_boleta: $data['numero_boleta'] ?? ('BOL-' . strtoupper(substr(md5(uniqid()), 0, 6))),
            emitido_por: $data['emitido_por'] ?? 'Sistema NovaDental',
            monto_total: (float) $data['monto_total'],
            tipo_pago: $normTipoPago,
            cantidad_cuotas: $normTipoPago === 'Contado' ? 1 : (isset($data['cantidad_cuotas']) ? max(1, (int) $data['cantidad_cuotas']) : 1),
            porcentaje_comision_dr: isset($data['porcentaje_comision_dr']) ? (float) $data['porcentaje_comision_dr'] : 40.0,
            costo_laboratorio: isset($data['costo_laboratorio']) ? (float) $data['costo_laboratorio'] : 0.0,
            monto_comision_dr: isset($data['monto_comision_dr']) ? (float) $data['monto_comision_dr'] : null,
            metodo_pago_contado: $data['metodo_pago'] ?? ($data['metodo_pago_contado'] ?? 'Efectivo'),
            estado: $data['estado'] ?? null,
            detalles: $data['detalles'] ?? [],
            cuotas: $data['cuotas'] ?? []
        );
    }
}
