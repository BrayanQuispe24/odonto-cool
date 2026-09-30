<?php

namespace App\Http\Requests\Diente;

use Illuminate\Foundation\Http\FormRequest;

class StoreDienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_diente' => ['required', 'integer', 'unique:dientes,numero_diente'],
            'nombre' => ['required', 'string', 'max:255'],
            'cuadrante' => ['nullable', 'string', 'max:100'],
            'tipo_denticion' => ['nullable', 'string', 'in:permanente,deciduo'],
            'descripcion' => ['nullable', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'estado' => ['nullable', 'boolean'],
        ];
    }
}
