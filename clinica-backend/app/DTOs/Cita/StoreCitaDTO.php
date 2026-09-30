<?php

namespace App\DTOs\Cita;

use App\Http\Requests\Cita\StoreCitaRequest;

class StoreCitaDTO
{
    public function __construct(
        public readonly ?string $numero_cita,
        public readonly int $doctor_id,
        public readonly int $sucursal_id,
        public readonly ?int $paciente_id,
        public readonly ?string $nombre_paciente_unregistered,
        public readonly string $fecha,
        public readonly string $hora_inicio,
        public readonly string $hora_fin,
        public readonly string $estado = 'confirmada'
    ) {}

    public static function fromRequest(StoreCitaRequest $request): self
    {
        return new self(
            numero_cita: $request->input('numero_cita'),
            doctor_id: (int) $request->input('doctor_id'),
            sucursal_id: (int) $request->input('sucursal_id'),
            paciente_id: $request->input('paciente_id') ? (int) $request->input('paciente_id') : null,
            nombre_paciente_unregistered: $request->input('nombre_paciente_unregistered'),
            fecha: (string) $request->input('fecha'),
            hora_inicio: (string) $request->input('hora_inicio'),
            hora_fin: (string) $request->input('hora_fin'),
            estado: (string) ($request->input('estado') ?? 'confirmada')
        );
    }
}
