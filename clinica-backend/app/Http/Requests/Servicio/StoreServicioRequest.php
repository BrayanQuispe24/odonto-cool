<?php

namespace App\Http\Requests\Servicio;

use Illuminate\Foundation\Http\FormRequest;

class StoreServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo_servicio' => ['nullable', 'string', 'max:50', 'unique:servicios,codigo_servicio'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'categoria' => ['nullable', 'string', 'max:100'],
            'precio' => ['required', 'numeric', 'min:0'],
            'duracion_estimada_minutos' => ['nullable', 'integer', 'min:5', 'max:480'],
            'estado' => ['nullable', 'boolean'],
        ];
    }
}
