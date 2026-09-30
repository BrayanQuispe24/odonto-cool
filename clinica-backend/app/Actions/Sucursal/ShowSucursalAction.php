<?php

namespace App\Actions\Sucursal;

use App\Models\Sucursal;

class ShowSucursalAction
{
    public function execute(Sucursal $sucursal): Sucursal
    {
        return $sucursal->load(['doctores.usuario', 'pacientes']);
    }
}
