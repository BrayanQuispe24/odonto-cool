<?php

namespace App\Actions\Paciente;

use App\Models\Paciente;

class ShowPacienteAction
{
    public function execute(Paciente $paciente): Paciente
    {
        return $paciente->load(['sucursal', 'antecedente', 'citas.doctor']);
    }
}
