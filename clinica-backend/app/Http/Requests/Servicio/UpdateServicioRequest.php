<?php

namespace App\Http\Requests\Servicio;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $servicio = $this->route('servicio');
        $servicioId = $servicio ? $servicio->id : null;

        return [
            'codigo_servicio' => ['sometimes', 'string', 'max:50', 'unique:servicios,codigo_servicio,' . $servicioId],
            'nombre' => ['sometimes', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'categoria' => ['sometimes', 'string', 'max:100'],
            'precio' => ['sometimes', 'numeric', 'min:0'],
            'duracion_estimada_minutos' => ['nullable', 'integer', 'min:5', 'max:480'],
            'estado' => ['nullable', 'boolean'],
        ];
    }
}
