<?php

namespace App\Http\Requests\Diente;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $diente = $this->route('diente');
        $dienteId = $diente ? $diente->id : null;

        return [
            'numero_diente' => ['sometimes', 'integer', 'unique:dientes,numero_diente,' . $dienteId],
            'nombre' => ['sometimes', 'string', 'max:255'],
            'cuadrante' => ['nullable', 'string', 'max:100'],
            'tipo_denticion' => ['sometimes', 'string', 'in:permanente,deciduo'],
            'descripcion' => ['nullable', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'estado' => ['nullable', 'boolean'],
        ];
    }
}
