<?php

namespace App\DTOs\Sucursal;

use App\Http\Requests\Sucursal\StoreSucursalRequest;

class StoreSucursalDTO
{
    public function __construct(
        public readonly string $codigo_sucursal,
        public readonly string $nombre,
        public readonly string $ubicacion,
        public readonly ?string $telefono,
        public readonly ?string $horario_atencion,
        public readonly bool $estado = true
    ) {}

    public static function fromRequest(StoreSucursalRequest $request): self
    {
        return new self(
            codigo_sucursal: (string) $request->input('codigo_sucursal'),
            nombre: (string) $request->input('nombre'),
            ubicacion: (string) $request->input('ubicacion'),
            telefono: $request->input('telefono') ? (string) $request->input('telefono') : null,
            horario_atencion: $request->input('horario_atencion') ? (string) $request->input('horario_atencion') : null,
            estado: $request->has('estado') ? (bool) $request->input('estado') : true
        );
    }
}
