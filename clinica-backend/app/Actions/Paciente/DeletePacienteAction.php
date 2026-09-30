<?php

namespace App\Actions\Paciente;

use App\Models\Paciente;

class DeletePacienteAction
{
    public function execute(Paciente $paciente): void
    {
        $paciente->delete();
    }
}
