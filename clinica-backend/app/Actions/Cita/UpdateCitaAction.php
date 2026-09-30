<?php

namespace App\Actions\Cita;

use App\DTOs\Cita\UpdateCitaDTO;
use App\Models\Cita;

class UpdateCitaAction
{
    public function execute(Cita $cita, UpdateCitaDTO $dto): Cita
    {
        $data = array_filter([
            'doctor_id' => $dto->doctor_id,
            'sucursal_id' => $dto->sucursal_id,
            'paciente_id' => $dto->paciente_id,
            'nombre_paciente_unregistered' => $dto->nombre_paciente_unregistered,
            'fecha' => $dto->fecha,
            'hora_inicio' => $dto->hora_inicio,
            'hora_fin' => $dto->hora_fin,
            'estado' => $dto->estado,
        ], fn($val) => !is_null($val));

        $cita->update($data);

        return $cita->fresh(['doctor.usuario', 'sucursal', 'paciente', 'boletaServicioPrestado']);
    }
}
