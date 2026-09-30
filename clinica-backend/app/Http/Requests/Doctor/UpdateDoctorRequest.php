<?php

namespace App\Http\Requests\Doctor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $doctorId = $this->route('doctore') ? $this->route('doctore')->id : null;

        return [
            'usuario_id' => ['nullable', 'integer', 'exists:users,id', 'unique:doctores,usuario_id,' . $doctorId],
            'sucursal_id' => ['required', 'integer', 'exists:sucursal,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'telefonos' => ['nullable', 'array'],
            'especialidades' => ['nullable', 'array'],
        ];
    }
}
