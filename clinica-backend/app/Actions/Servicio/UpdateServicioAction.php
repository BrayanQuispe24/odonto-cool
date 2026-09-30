<?php

namespace App\Actions\Servicio;

use App\DTOs\Servicio\UpdateServicioDTO;
use App\Models\Servicio;

class UpdateServicioAction
{
    public function execute(Servicio $servicio, UpdateServicioDTO $dto): Servicio
    {
        $data = array_filter([
            'codigo_servicio' => $dto->codigo_servicio,
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
            'categoria' => $dto->categoria,
            'precio' => $dto->precio,
            'duracion_estimada_minutos' => $dto->duracion_estimada_minutos,
            'estado' => $dto->estado,
        ], fn($val) => $val !== null);

        $servicio->update($data);
        return $servicio->fresh();
    }
}
