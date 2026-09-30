<?php

namespace App\Actions\Diente;

use App\DTOs\Diente\StoreDienteDTO;
use App\Models\Diente;

class StoreDienteAction
{
    public function execute(StoreDienteDTO $dto): Diente
    {
        return Diente::create([
            'numero_diente' => $dto->numero_diente,
            'nombre' => $dto->nombre,
            'cuadrante' => $dto->cuadrante,
            'tipo_denticion' => $dto->tipo_denticion,
            'descripcion' => $dto->descripcion,
            'url' => $dto->url,
            'estado' => $dto->estado,
        ]);
    }
}
