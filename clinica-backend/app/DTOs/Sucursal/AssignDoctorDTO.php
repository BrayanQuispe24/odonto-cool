<?php

namespace App\DTOs\Sucursal;

use App\Http\Requests\Sucursal\AssignDoctorRequest;

class AssignDoctorDTO
{
    public function __construct(
        public readonly int $doctor_id,
        public readonly int $sucursal_id
    ) {}

    public static function fromRequest(AssignDoctorRequest $request, int $sucursal_id): self
    {
        return new self(
            doctor_id: (int) $request->input('doctor_id'),
            sucursal_id: $sucursal_id
        );
    }
}
