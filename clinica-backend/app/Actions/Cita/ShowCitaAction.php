<?php

namespace App\Actions\Cita;

use App\Models\Cita;

class ShowCitaAction
{
    public function execute(Cita $cita): Cita
    {
        return $cita->load(['doctor.usuario', 'sucursal', 'paciente', 'boletaServicioPrestado']);
    }
}
