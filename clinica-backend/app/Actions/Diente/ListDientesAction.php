<?php

namespace App\Actions\Diente;

use App\Models\Diente;
use Illuminate\Database\Eloquent\Collection;

class ListDientesAction
{
    public function execute(?string $cuadrante = null, ?string $tipoDenticion = null, ?bool $estado = null): Collection
    {
        return Diente::query()
            ->when($cuadrante, function ($query) use ($cuadrante) {
                $query->where('cuadrante', $cuadrante);
            })
            ->when($tipoDenticion, function ($query) use ($tipoDenticion) {
                $query->where('tipo_denticion', $tipoDenticion);
            })
            ->when($estado !== null, function ($query) use ($estado) {
                $query->where('estado', $estado);
            })
            ->orderBy('numero_diente', 'asc')
            ->get();
    }
}
