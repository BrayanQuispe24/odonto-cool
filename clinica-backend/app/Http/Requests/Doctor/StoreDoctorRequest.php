<?php

namespace App\Http\Requests\Doctor;

use Illuminate\Foundation\Http\FormRequest;

class StoreDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'usuario_id' => ['required', 'integer', 'exists:users,id', 'unique:doctores,usuario_id'],
            'sucursal_id' => ['required', 'integer', 'exists:sucursal,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'telefonos' => ['nullable', 'array'],
            'especialidades' => ['nullable', 'array'],
        ];
    }
}
