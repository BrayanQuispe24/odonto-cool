<?php

namespace App\Actions\Sucursal;

use App\Models\Sucursal;

class DeleteSucursalAction
{
    public function execute(Sucursal $sucursal): bool
    {
        return $sucursal->delete();
    }
}
