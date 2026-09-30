<?php

namespace App\Actions\Diente;

use App\Models\Diente;

class DeleteDienteAction
{
    public function execute(Diente $diente): bool
    {
        return (bool) $diente->delete();
    }
}
