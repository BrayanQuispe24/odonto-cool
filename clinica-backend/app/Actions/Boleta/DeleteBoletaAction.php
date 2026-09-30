<?php

namespace App\Actions\Boleta;

use App\Models\BoletaServicioPrestado;

class DeleteBoletaAction
{
    public function execute(BoletaServicioPrestado $boleta): bool
    {
        return (bool) $boleta->delete();
    }
}
