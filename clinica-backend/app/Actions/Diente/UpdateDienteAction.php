<?php

namespace App\Actions\Diente;

use App\DTOs\Diente\UpdateDienteDTO;
use App\Models\Diente;

class UpdateDienteAction
{
    public function execute(Diente $diente, UpdateDienteDTO $dto): Diente
    {
        $data = array_filter([
            'numero_diente' => $dto->numero_diente,
            'nombre' => $dto->nombre,
            'cuadrante' => $dto->cuadrante,
            'tipo_denticion' => $dto->tipo_denticion,
            'descripcion' => $dto->descripcion,
            'url' => $dto->url,
            'estado' => $dto->estado,
        ], fn($val) => $val !== null);

        $diente->update($data);
        return $diente->fresh();
    }
}
