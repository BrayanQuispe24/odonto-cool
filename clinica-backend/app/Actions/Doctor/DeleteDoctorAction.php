<?php

namespace App\Actions\Doctor;

use App\Models\Doctor;

class DeleteDoctorAction
{
    public function execute(Doctor $doctor): void
    {
        $doctor->delete();
    }
}
