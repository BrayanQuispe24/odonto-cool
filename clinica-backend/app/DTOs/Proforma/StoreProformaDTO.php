<?php

namespace App\DTOs\Proforma;

class StoreProformaDTO
{
    public function __construct(
        public ?int $paciente_id,
        public ?int $doctor_id,
        public int $sucursal_id,
        public string $nombre,
        public string $apellido,
        public int $edad,
        public string $sexo,
        public string $celular,
        public ?string $fecha_nacimiento,
        public ?string $domicilio_actual,
        public string $fecha_emision,
        public int $dias_validez,
        public ?string $observaciones,
        public array $detalles
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            paciente_id: isset($data['paciente_id']) && $data['paciente_id'] ? (int) $data['paciente_id'] : null,
            doctor_id: isset($data['doctor_id']) && $data['doctor_id'] ? (int) $data['doctor_id'] : null,
            sucursal_id: (int) ($data['sucursal_id'] ?? 1),
            nombre: trim($data['nombre']),
            apellido: trim($data['apellido']),
            edad: (int) ($data['edad'] ?? 0),
            sexo: $data['sexo'] ?? 'M',
            celular: trim($data['celular']),
            fecha_nacimiento: !empty($data['fecha_nacimiento']) ? $data['fecha_nacimiento'] : null,
            domicilio_actual: !empty($data['domicilio_actual']) ? trim($data['domicilio_actual']) : null,
            fecha_emision: $data['fecha_emision'] ?? date('Y-m-d'),
            dias_validez: isset($data['dias_validez']) ? max(1, (int) $data['dias_validez']) : 15,
            observaciones: !empty($data['observaciones']) ? trim($data['observaciones']) : null,
            detalles: $data['detalles'] ?? []
        );
    }
}
