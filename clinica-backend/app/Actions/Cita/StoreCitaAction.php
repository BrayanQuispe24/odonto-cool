<?php

namespace App\Actions\Cita;

use App\DTOs\Cita\StoreCitaDTO;
use App\Models\Cita;

class StoreCitaAction
{
    public function execute(StoreCitaDTO $dto): Cita
    {
        $numeroCita = $dto->numero_cita;
        if (empty($numeroCita)) {
            $nextId = (Cita::max('id') ?? 0) + 1;
            $numeroCita = 'CIT-' . str_pad((string)$nextId, 4, '0', STR_PAD_LEFT);
        }

        $cita = Cita::create([
            'numero_cita' => $numeroCita,
            'doctor_id' => $dto->doctor_id,
            'sucursal_id' => $dto->sucursal_id,
            'paciente_id' => $dto->paciente_id,
            'nombre_paciente_unregistered' => $dto->nombre_paciente_unregistered,
            'fecha' => $dto->fecha,
            'hora_inicio' => $dto->hora_inicio,
            'hora_fin' => $dto->hora_fin,
            'estado' => $dto->estado ?? 'pendiente',
        ]);

        return $cita->load(['doctor.usuario', 'sucursal', 'paciente', 'boletaServicioPrestado']);
    }
}
