<?php

namespace App\Http\Requests\Paciente;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePacienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pacienteId = $this->route('paciente') ? $this->route('paciente')->id : null;

        return [
            'codigo_paciente' => ['required', 'string', 'max:50', 'unique:pacientes,codigo_paciente,' . $pacienteId],
            'sucursal_id' => ['required', 'integer', 'exists:sucursal,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'edad' => ['required', 'integer', 'min:0', 'max:130'],
            'sexo' => ['required', 'string', 'in:Masculino,Femenino,Otro'],
            'ocupacion' => ['nullable', 'string', 'max:255'],
            'estado_civil' => ['nullable', 'string', 'max:255'],
            'celular' => ['nullable', 'string', 'max:50'],
            'domicilio_actual' => ['nullable', 'string', 'max:500'],
            'fecha_nacimiento' => ['required', 'date'],
            'telefono_emergencia' => ['nullable', 'string', 'max:50'],
            'nombre_contacto_emergencia' => ['nullable', 'string', 'max:255'],
            'apellido_contacto_emergencia' => ['nullable', 'string', 'max:255'],
            'parentesco_contacto_emergencia' => ['nullable', 'string', 'max:255'],
        ];
    }
}
