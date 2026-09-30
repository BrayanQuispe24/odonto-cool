<?php

namespace App\Actions\Paciente;

use App\DTOs\Paciente\UpdatePacienteDTO;
use App\Models\Paciente;

class UpdatePacienteAction
{
    public function execute(Paciente $paciente, UpdatePacienteDTO $dto): Paciente
    {
        $paciente->update([
            'codigo_paciente' => $dto->codigo_paciente,
            'sucursal_id' => $dto->sucursal_id,
            'nombre' => $dto->nombre,
            'apellido' => $dto->apellido,
            'edad' => $dto->edad,
            'sexo' => $dto->sexo,
            'ocupacion' => $dto->ocupacion,
            'estado_civil' => $dto->estado_civil,
            'celular' => $dto->celular,
            'domicilio_actual' => $dto->domicilio_actual,
            'fecha_nacimiento' => $dto->fecha_nacimiento,
            'telefono_emergencia' => $dto->telefono_emergencia,
            'nombre_contacto_emergencia' => $dto->nombre_contacto_emergencia,
            'apellido_contacto_emergencia' => $dto->apellido_contacto_emergencia,
            'parentesco_contacto_emergencia' => $dto->parentesco_contacto_emergencia,
        ]);

        return $paciente->fresh(['sucursal', 'antecedente', 'citas']);
    }
}
