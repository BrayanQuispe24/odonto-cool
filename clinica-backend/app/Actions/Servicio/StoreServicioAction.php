<?php

namespace App\Actions\Servicio;

use App\DTOs\Servicio\StoreServicioDTO;
use App\Models\Servicio;

class StoreServicioAction
{
    public function execute(StoreServicioDTO $dto): Servicio
    {
        $codigo = $dto->codigo_servicio;

        if (!$codigo) {
            $lastId = (Servicio::max('id') ?? 0) + 1;
            $codigo = 'SERV-' . str_pad((string) $lastId, 3, '0', STR_PAD_LEFT);
        }

        return Servicio::create([
            'codigo_servicio' => $codigo,
            'nombre' => $dto->nombre,
            'descripcion' => $dto->descripcion,
            'categoria' => $dto->categoria,
            'precio' => $dto->precio,
            'duracion_estimada_minutos' => $dto->duracion_estimada_minutos,
            'estado' => $dto->estado,
        ]);
    }
}
