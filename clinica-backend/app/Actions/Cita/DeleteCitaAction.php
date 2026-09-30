<?php

namespace App\Actions\Cita;

use App\Models\Cita;

class DeleteCitaAction
{
    public function execute(Cita $cita): bool
    {
        return (bool) $cita->delete();
    }
}
