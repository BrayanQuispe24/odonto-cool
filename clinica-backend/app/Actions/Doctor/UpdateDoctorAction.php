<?php

namespace App\Actions\Doctor;

use App\DTOs\Doctor\UpdateDoctorDTO;
use App\Models\Doctor;

class UpdateDoctorAction
{
    public function execute(Doctor $doctor, UpdateDoctorDTO $dto): Doctor
    {
        $payload = [
            'sucursal_id' => $dto->sucursal_id,
            'nombre' => $dto->nombre,
            'apellido' => $dto->apellido,
            'telefonos' => $dto->telefonos,
            'especialidades' => $dto->especialidades,
        ];

        if ($dto->usuario_id !== null) {
            $payload['usuario_id'] = $dto->usuario_id;
        }

        $doctor->update($payload);

        return $doctor->fresh(['usuario', 'sucursal']);
    }
}
