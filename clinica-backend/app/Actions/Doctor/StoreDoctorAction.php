<?php

namespace App\Actions\Doctor;

use App\DTOs\Doctor\StoreDoctorDTO;
use App\Models\Doctor;

class StoreDoctorAction
{
    public function execute(StoreDoctorDTO $dto): Doctor
    {
        $doctor = Doctor::create([
            'usuario_id' => $dto->usuario_id,
            'sucursal_id' => $dto->sucursal_id,
            'nombre' => $dto->nombre,
            'apellido' => $dto->apellido,
            'telefonos' => $dto->telefonos,
            'especialidades' => $dto->especialidades,
        ]);

        return $doctor->load(['usuario', 'sucursal']);
    }
}
