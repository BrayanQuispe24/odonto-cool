<?php

namespace App\DTOs\Diente;

use App\Http\Requests\Diente\UpdateDienteRequest;

class UpdateDienteDTO
{
    public function __construct(
        public readonly ?int $numero_diente,
        public readonly ?string $nombre,
        public readonly ?string $cuadrante,
        public readonly ?string $tipo_denticion,
        public readonly ?string $descripcion,
        public readonly ?string $url,
        public readonly ?bool $estado
    ) {}

    public static function fromRequest(UpdateDienteRequest $request): self
    {
        return new self(
            numero_diente: $request->has('numero_diente') ? (int) $request->input('numero_diente') : null,
            nombre: $request->input('nombre'),
            cuadrante: $request->input('cuadrante'),
            tipo_denticion: $request->input('tipo_denticion'),
            descripcion: $request->input('descripcion'),
            url: $request->input('url'),
            estado: $request->has('estado') ? (bool) $request->input('estado') : null
        );
    }
}
