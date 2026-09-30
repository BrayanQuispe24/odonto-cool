<?php

namespace App\Http\Requests\Sucursal;

use Illuminate\Foundation\Http\FormRequest;

class StoreSucursalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo_sucursal' => ['required', 'string', 'max:50', 'unique:sucursal,codigo_sucursal'],
            'nombre' => ['required', 'string', 'max:255'],
            'ubicacion' => ['required', 'string', 'max:500'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'horario_atencion' => ['nullable', 'string', 'max:255'],
            'estado' => ['nullable', 'boolean'],
        ];
    }
}
