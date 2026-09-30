<?php

namespace App\DTOs\Doctor;

use App\Http\Requests\Doctor\UpdateDoctorRequest;

class UpdateDoctorDTO
{
    public function __construct(
        public readonly ?int $usuario_id,
        public readonly int $sucursal_id,
        public readonly string $nombre,
        public readonly string $apellido,
        public readonly ?array $telefonos,
        public readonly ?array $especialidades
    ) {}

    public static function fromRequest(UpdateDoctorRequest $request): self
    {
        return new self(
            usuario_id: $request->filled('usuario_id') ? (int) $request->input('usuario_id') : null,
            sucursal_id: (int) $request->input('sucursal_id'),
            nombre: (string) $request->input('nombre'),
            apellido: (string) $request->input('apellido'),
            telefonos: $request->input('telefonos') ? (array) $request->input('telefonos') : null,
            especialidades: $request->input('especialidades') ? (array) $request->input('especialidades') : null
        );
    }
}
