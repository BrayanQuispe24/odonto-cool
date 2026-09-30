<?php

namespace App\Http\Requests\Cita;

use App\Services\CitaValidationService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreCitaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_cita' => ['nullable', 'string', 'max:50', 'unique:citas,numero_cita'],
            'doctor_id' => ['required', 'integer', 'exists:doctores,id'],
            'sucursal_id' => ['required', 'integer', 'exists:sucursal,id'],
            'paciente_id' => ['nullable', 'required_without:nombre_paciente_unregistered', 'integer', 'exists:pacientes,id'],
            'nombre_paciente_unregistered' => ['nullable', 'required_without:paciente_id', 'string', 'max:255'],
            'fecha' => ['required', 'date'],
            'hora_inicio' => ['required', 'date_format:H:i,H:i:s'],
            'hora_fin' => ['required', 'date_format:H:i,H:i:s'],
            'estado' => ['nullable', 'string', 'in:pendiente,confirmada,cancelada,finalizada'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->any()) {
                return;
            }

            $validationService = app(CitaValidationService::class);

            $sucursalErr = $validationService->validarHorarioSucursal(
                (int) $this->input('sucursal_id'),
                (string) $this->input('hora_inicio'),
                (string) $this->input('hora_fin')
            );
            if ($sucursalErr) {
                $validator->errors()->add('hora_inicio', $sucursalErr);
                return;
            }

            $doctorErr = $validationService->validarTraslapeDoctor(
                (int) $this->input('doctor_id'),
                (string) $this->input('fecha'),
                (string) $this->input('hora_inicio'),
                (string) $this->input('hora_fin')
            );
            if ($doctorErr) {
                $validator->errors()->add('hora_inicio', $doctorErr);
            }
        });
    }
}
