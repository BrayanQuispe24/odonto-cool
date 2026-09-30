<?php

namespace App\Actions\Boleta;

use App\Models\BoletaServicioPrestado;

class ShowBoletaAction
{
    public function execute(BoletaServicioPrestado $boleta): BoletaServicioPrestado
    {
        return $boleta->load([
            'cita.doctor.usuario',
            'cita.paciente',
            'cita.sucursal',
            'doctor.usuario',
            'detalles.servicio',
            'detalles.diente',
            'cuotas',
        ]);
    }
}
