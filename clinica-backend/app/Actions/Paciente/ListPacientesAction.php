<?php

namespace App\Actions\Paciente;

use App\Models\Paciente;
use Illuminate\Database\Eloquent\Collection;

class ListPacientesAction
{
    public function execute(): Collection
    {
        return Paciente::with(['sucursal', 'antecedente', 'citas'])->latest()->get();
    }
}
