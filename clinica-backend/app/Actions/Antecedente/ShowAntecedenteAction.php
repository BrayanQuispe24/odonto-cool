<?php

namespace App\Actions\Antecedente;

use App\Models\Antecedente;
use App\Models\Paciente;

class ShowAntecedenteAction
{
    public function execute(Paciente $paciente): Antecedente
    {
        return Antecedente::firstOrCreate(['paciente_id' => $paciente->id]);
    }
}
