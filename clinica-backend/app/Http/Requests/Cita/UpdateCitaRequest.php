<?php

namespace App\Http\Requests\Cita;

use App\Services\CitaValidationService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCitaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doctor_id' => ['sometimes', 'integer', 'exists:doctores,id'],
            'sucursal_id' => ['sometimes', 'integer', 'exists:sucursal,id'],
            'paciente_id' => ['nullable', 'integer', 'exists:pacientes,id'],
            'nombre_paciente_unregistered' => ['nullable', 'string', 'max:255'],
            'fecha' => ['sometimes', 'date'],
            'hora_inicio' => ['sometimes', 'date_format:H:i,H:i:s'],
            'hora_fin' => ['sometimes', 'date_format:H:i,H:i:s'],
            'estado' => ['sometimes', 'string', 'in:pendiente,confirmada,cancelada,finalizada'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->any()) {
                return;
            }

            $user = $this->user();
            $cita = $this->route('cita');
            $nuevoEstado = $this->input('estado');

            // Solo el doctor puede aprobar (confirmada) o cancelar (cancelada) citas
            if ($nuevoEstado && $cita && $nuevoEstado !== $cita->estado) {
                if (in_array($nuevoEstado, ['confirmada', 'cancelada'])) {
                    if (!$user || !$user->rol || $user->rol->nombre !== 'Doctor') {
                        $validator->errors()->add('estado', 'Solo los usuarios con rol Doctor pueden aprobar o cancelar una cita.');
                        return;
                    }
                }
            }

            $doctorId = (int) ($this->input('doctor_id') ?? $cita?->doctor_id);
            $sucursalId = (int) ($this->input('sucursal_id') ?? $cita?->sucursal_id);
            $fecha = (string) ($this->input('fecha') ?? $cita?->fecha);
            $horaInicio = (string) ($this->input('hora_inicio') ?? $cita?->hora_inicio);
            $horaFin = (string) ($this->input('hora_fin') ?? $cita?->hora_fin);

            $validationService = app(CitaValidationService::class);

            if ($sucursalId && $horaInicio && $horaFin) {
                $sucursalErr = $validationService->validarHorarioSucursal($sucursalId, $horaInicio, $horaFin);
                if ($sucursalErr) {
                    $validator->errors()->add('hora_inicio', $sucursalErr);
                    return;
                }
            }

            if ($doctorId && $fecha && $horaInicio && $horaFin) {
                $doctorErr = $validationService->validarTraslapeDoctor(
                    $doctorId,
                    $fecha,
                    $horaInicio,
                    $horaFin,
                    $cita?->id
                );
                if ($doctorErr) {
                    $validator->errors()->add('hora_inicio', $doctorErr);
                }
            }
        });
    }
}
