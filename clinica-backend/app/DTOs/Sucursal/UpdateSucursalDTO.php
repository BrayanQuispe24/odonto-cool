<?php

namespace App\DTOs\Sucursal;

use App\Http\Requests\Sucursal\UpdateSucursalRequest;

class UpdateSucursalDTO
{
    public function __construct(
        public readonly ?string $codigo_sucursal,
        public readonly ?string $nombre,
        public readonly ?string $ubicacion,
        public readonly ?string $telefono,
        public readonly ?string $horario_atencion,
        public readonly ?bool $estado
    ) {}

    public static function fromRequest(UpdateSucursalRequest $request): self
    {
        return new self(
            codigo_sucursal: $request->has('codigo_sucursal') ? (string) $request->input('codigo_sucursal') : null,
            nombre: $request->has('nombre') ? (string) $request->input('nombre') : null,
            ubicacion: $request->has('ubicacion') ? (string) $request->input('ubicacion') : null,
            telefono: $request->has('telefono') ? (string) $request->input('telefono') : null,
            horario_atencion: $request->has('horario_atencion') ? (string) $request->input('horario_atencion') : null,
            estado: $request->has('estado') ? (bool) $request->input('estado') : null
        );
    }
}
