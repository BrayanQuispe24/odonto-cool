<?php

namespace App\DTOs\Paciente;

use App\Http\Requests\Paciente\UpdatePacienteRequest;

class UpdatePacienteDTO
{
    public function __construct(
        public readonly string $codigo_paciente,
        public readonly int $sucursal_id,
        public readonly string $nombre,
        public readonly string $apellido,
        public readonly int $edad,
        public readonly string $sexo,
        public readonly ?string $ocupacion,
        public readonly ?string $estado_civil,
        public readonly ?string $celular,
        public readonly ?string $domicilio_actual,
        public readonly string $fecha_nacimiento,
        public readonly ?string $telefono_emergencia,
        public readonly ?string $nombre_contacto_emergencia,
        public readonly ?string $apellido_contacto_emergencia,
        public readonly ?string $parentesco_contacto_emergencia
    ) {}

    public static function fromRequest(UpdatePacienteRequest $request): self
    {
        return new self(
            codigo_paciente: (string) $request->input('codigo_paciente'),
            sucursal_id: (int) $request->input('sucursal_id'),
            nombre: (string) $request->input('nombre'),
            apellido: (string) $request->input('apellido'),
            edad: (int) $request->input('edad'),
            sexo: (string) $request->input('sexo'),
            ocupacion: $request->input('ocupacion'),
            estado_civil: $request->input('estado_civil'),
            celular: $request->input('celular'),
            domicilio_actual: $request->input('domicilio_actual'),
            fecha_nacimiento: (string) $request->input('fecha_nacimiento'),
            telefono_emergencia: $request->input('telefono_emergencia'),
            nombre_contacto_emergencia: $request->input('nombre_contacto_emergencia'),
            apellido_contacto_emergencia: $request->input('apellido_contacto_emergencia'),
            parentesco_contacto_emergencia: $request->input('parentesco_contacto_emergencia')
        );
    }
}
