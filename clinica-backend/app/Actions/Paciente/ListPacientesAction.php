<?php

namespace App\Actions\Paciente;

use App\Models\Paciente;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ListPacientesAction
{
    public function execute(?int $perPage = null): LengthAwarePaginator|Collection
    {
        $query = Paciente::with(['sucursal', 'antecedente', 'citas'])->latest();

        if ($perPage && $perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }
}
