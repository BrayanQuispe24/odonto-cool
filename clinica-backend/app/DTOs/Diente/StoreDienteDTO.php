<?php

namespace App\DTOs\Diente;

use App\Http\Requests\Diente\StoreDienteRequest;

class StoreDienteDTO
{
    public function __construct(
        public readonly int $numero_diente,
        public readonly string $nombre,
        public readonly ?string $cuadrante,
        public readonly string $tipo_denticion = 'permanente',
        public readonly ?string $descripcion = null,
        public readonly ?string $url = null,
        public readonly bool $estado = true
    ) {}

    public static function fromRequest(StoreDienteRequest $request): self
    {
        return new self(
            numero_diente: (int) $request->input('numero_diente'),
            nombre: (string) $request->input('nombre'),
            cuadrante: $request->input('cuadrante'),
            tipo_denticion: (string) ($request->input('tipo_denticion') ?? 'permanente'),
            descripcion: $request->input('descripcion'),
            url: $request->input('url'),
            estado: $request->has('estado') ? (bool) $request->input('estado') : true
        );
    }
}
