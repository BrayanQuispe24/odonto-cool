<?php

namespace App\Actions\Paciente;

use App\DTOs\Paciente\StorePacienteDTO;
use App\Models\Antecedente;
use App\Models\Paciente;

class StorePacienteAction
{
    public function execute(StorePacienteDTO $dto): Paciente
    {
        $paciente = Paciente::create([
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

        // Auto-create initial antecedente record 1:1
        Antecedente::firstOrCreate(['paciente_id' => $paciente->id]);

        return $paciente->load(['sucursal', 'antecedente', 'citas']);
    }
}
