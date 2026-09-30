<?php

namespace App\DTOs\Servicio;

use App\Http\Requests\Servicio\UpdateServicioRequest;

class UpdateServicioDTO
{
    public function __construct(
        public readonly ?string $codigo_servicio,
        public readonly ?string $nombre,
        public readonly ?string $descripcion,
        public readonly ?string $categoria,
        public readonly ?float $precio,
        public readonly ?int $duracion_estimada_minutos,
        public readonly ?bool $estado
    ) {}

    public static function fromRequest(UpdateServicioRequest $request): self
    {
        return new self(
            codigo_servicio: $request->input('codigo_servicio'),
            nombre: $request->input('nombre'),
            descripcion: $request->input('descripcion'),
            categoria: $request->input('categoria'),
            precio: $request->has('precio') ? (float) $request->input('precio') : null,
            duracion_estimada_minutos: $request->has('duracion_estimada_minutos') ? (int) $request->input('duracion_estimada_minutos') : null,
            estado: $request->has('estado') ? (bool) $request->input('estado') : null
        );
    }
}
