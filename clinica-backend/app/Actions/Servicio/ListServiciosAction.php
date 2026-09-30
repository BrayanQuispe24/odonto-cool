<?php

namespace App\Actions\Servicio;

use App\Models\Servicio;
use Illuminate\Database\Eloquent\Collection;

class ListServiciosAction
{
    public function execute(?string $categoria = null, ?bool $estado = null): Collection
    {
        return Servicio::query()
            ->when($categoria, function ($query) use ($categoria) {
                $query->where('categoria', $categoria);
            })
            ->when($estado !== null, function ($query) use ($estado) {
                $query->where('estado', $estado);
            })
            ->orderBy('nombre', 'asc')
            ->get();
    }
}
