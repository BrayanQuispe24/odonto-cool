<?php

namespace App\Actions\Sucursal;

use App\DTOs\Sucursal\AssignDoctorDTO;
use App\Models\Doctor;
use App\Models\Sucursal;

class AssignDoctorSucursalAction
{
    public function execute(Sucursal $sucursal, AssignDoctorDTO $dto): Doctor
    {
        $doctor = Doctor::findOrFail($dto->doctor_id);
        $doctor->update([
            'sucursal_id' => $sucursal->id,
        ]);

        return $doctor->load(['usuario', 'sucursal']);
    }
}
