<?php

namespace App\Actions\Sucursal;

use App\DTOs\Sucursal\UpdateSucursalDTO;
use App\Models\Sucursal;

class UpdateSucursalAction
{
    public function execute(Sucursal $sucursal, UpdateSucursalDTO $dto): Sucursal
    {
        $data = array_filter([
            'codigo_sucursal' => $dto->codigo_sucursal,
            'nombre' => $dto->nombre,
            'ubicacion' => $dto->ubicacion,
            'telefono' => $dto->telefono,
            'horario_atencion' => $dto->horario_atencion,
            'estado' => $dto->estado,
        ], fn ($val) => !is_null($val));

        $sucursal->update($data);

        return $sucursal->fresh(['doctores', 'pacientes']);
    }
}
