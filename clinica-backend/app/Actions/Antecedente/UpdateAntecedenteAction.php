<?php

namespace App\Actions\Antecedente;

use App\Models\Antecedente;
use App\Models\Paciente;

class UpdateAntecedenteAction
{
    public function execute(Paciente $paciente, array $data): Antecedente
    {
        $antecedente = Antecedente::firstOrCreate(['paciente_id' => $paciente->id]);
        $antecedente->update($data);
        return $antecedente->fresh();
    }
}
