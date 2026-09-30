<?php

namespace App\Actions\Sucursal;

use App\Models\Sucursal;
use Illuminate\Database\Eloquent\Collection;

class ListSucursalesAction
{
    public function execute(): Collection
    {
        return Sucursal::with(['doctores.usuario'])->withCount(['doctores', 'pacientes', 'users'])->latest()->get();
    }
}
