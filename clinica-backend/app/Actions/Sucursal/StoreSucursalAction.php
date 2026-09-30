<?php

namespace App\Actions\Sucursal;

use App\DTOs\Sucursal\StoreSucursalDTO;
use App\Models\Sucursal;

class StoreSucursalAction
{
    public function execute(StoreSucursalDTO $dto): Sucursal
    {
        return Sucursal::create([
            'codigo_sucursal' => $dto->codigo_sucursal,
            'nombre' => $dto->nombre,
            'ubicacion' => $dto->ubicacion,
            'telefono' => $dto->telefono,
            'horario_atencion' => $dto->horario_atencion,
            'estado' => $dto->estado,
        ]);
    }
}
