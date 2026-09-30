<?php

namespace App\Actions\Servicio;

use App\Models\Servicio;

class DeleteServicioAction
{
    public function execute(Servicio $servicio): bool
    {
        return (bool) $servicio->delete();
    }
}
