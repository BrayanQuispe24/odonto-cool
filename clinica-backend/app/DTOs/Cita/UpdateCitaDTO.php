<?php

namespace App\DTOs\Cita;

use App\Http\Requests\Cita\UpdateCitaRequest;

class UpdateCitaDTO
{
    public function __construct(
        public readonly ?int $doctor_id,
        public readonly ?int $sucursal_id,
        public readonly ?int $paciente_id,
        public readonly ?string $nombre_paciente_unregistered,
        public readonly ?string $fecha,
        public readonly ?string $hora_inicio,
        public readonly ?string $hora_fin,
        public readonly ?string $estado
    ) {}

    public static function fromRequest(UpdateCitaRequest $request): self
    {
        return new self(
            doctor_id: $request->has('doctor_id') ? (int) $request->input('doctor_id') : null,
            sucursal_id: $request->has('sucursal_id') ? (int) $request->input('sucursal_id') : null,
            paciente_id: $request->has('paciente_id') ? (int) $request->input('paciente_id') : null,
            nombre_paciente_unregistered: $request->input('nombre_paciente_unregistered'),
            fecha: $request->input('fecha'),
            hora_inicio: $request->input('hora_inicio'),
            hora_fin: $request->input('hora_fin'),
            estado: $request->input('estado')
        );
    }
}
