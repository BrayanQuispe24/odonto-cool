<?php

namespace App\DTOs\Servicio;

use App\Http\Requests\Servicio\StoreServicioRequest;

class StoreServicioDTO
{
    public function __construct(
        public readonly ?string $codigo_servicio,
        public readonly string $nombre,
        public readonly ?string $descripcion,
        public readonly ?string $categoria,
        public readonly float $precio,
        public readonly int $duracion_estimada_minutos = 30,
        public readonly bool $estado = true
    ) {}

    public static function fromRequest(StoreServicioRequest $request): self
    {
        return new self(
            codigo_servicio: $request->input('codigo_servicio'),
            nombre: (string) $request->input('nombre'),
            descripcion: $request->input('descripcion'),
            categoria: $request->input('categoria') ? (string) $request->input('categoria') : null,
            precio: (float) $request->input('precio'),
            duracion_estimada_minutos: (int) ($request->input('duracion_estimada_minutos') ?? 30),
            estado: $request->has('estado') ? (bool) $request->input('estado') : true
        );
    }
}
