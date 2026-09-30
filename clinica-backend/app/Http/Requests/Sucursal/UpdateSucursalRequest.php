<?php

namespace App\Http\Requests\Sucursal;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSucursalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $sucursalId = $this->route('sucursal') ? $this->route('sucursal')->id : null;

        return [
            'codigo_sucursal' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('sucursal', 'codigo_sucursal')->ignore($sucursalId)],
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'ubicacion' => ['sometimes', 'required', 'string', 'max:500'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'horario_atencion' => ['nullable', 'string', 'max:255'],
            'estado' => ['sometimes', 'boolean'],
        ];
    }
}
