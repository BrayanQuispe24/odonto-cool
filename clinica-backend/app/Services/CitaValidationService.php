<?php

namespace App\Services;

use App\Models\Cita;
use App\Models\Sucursal;

class CitaValidationService
{
    /**
     * Valida si el horario está dentro de los límites de atención de la sucursal.
     */
    public function validarHorarioSucursal(Sucursal|int $sucursal, string $horaInicio, string $horaFin): ?string
    {
        // 1. Validar orden de horas
        $inicioTs = strtotime($horaInicio);
        $finTs = strtotime($horaFin);

        if (!$inicioTs || !$finTs || $inicioTs >= $finTs) {
            return 'La hora de inicio debe ser estrictamente anterior a la hora de fin.';
        }

        // 2. Obtener modelo Sucursal
        if (is_int($sucursal)) {
            $sucursalModel = Sucursal::find($sucursal);
        } else {
            $sucursalModel = $sucursal;
        }

        if (!$sucursalModel) {
            return 'La sucursal especificada no existe.';
        }

        $horarioStr = $sucursalModel->horario_atencion ?? '08:00 - 20:00';

        // Parsear formato HH:MM - HH:MM
        if (preg_match('/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/', $horarioStr, $matches)) {
            $aperturaStr = sprintf('%05s', $matches[1]);
            $cierreStr = sprintf('%05s', $matches[2]);

            $aperturaTs = strtotime($aperturaStr);
            $cierreTs = strtotime($cierreStr);

            $horaInicioFormatted = date('H:i', $inicioTs);
            $horaFinFormatted = date('H:i', $finTs);

            if ($inicioTs < $aperturaTs || $finTs > $cierreTs) {
                return "La cita ({$horaInicioFormatted} - {$horaFinFormatted}) está fuera del horario de atención de la sucursal ({$matches[1]} - {$matches[2]}).";
            }
        }

        return null;
    }

    /**
     * Valida que no exista choque o traslape de horario para el doctor.
     */
    public function validarTraslapeDoctor(
        int $doctorId,
        string $fecha,
        string $horaInicio,
        string $horaFin,
        ?int $ignoreCitaId = null
    ): ?string {
        $inicioFormatted = date('H:i:s', strtotime($horaInicio));
        $finFormatted = date('H:i:s', strtotime($horaFin));

        $citaConflicto = Cita::with(['paciente'])
            ->where('doctor_id', $doctorId)
            ->where('fecha', $fecha)
            ->where('estado', '!=', 'cancelada')
            ->when($ignoreCitaId, function ($query) use ($ignoreCitaId) {
                $query->where('id', '!=', $ignoreCitaId);
            })
            ->where(function ($query) use ($inicioFormatted, $finFormatted) {
                $query->where('hora_inicio', '<', $finFormatted)
                      ->where('hora_fin', '>', $inicioFormatted);
            })
            ->first();

        if ($citaConflicto) {
            $pacienteNombre = $citaConflicto->paciente 
                ? "{$citaConflicto->paciente->nombre} {$citaConflicto->paciente->apellido}" 
                : ($citaConflicto->nombre_paciente_unregistered ?? 'Paciente no registrado');
                
            $hInicio = substr($citaConflicto->hora_inicio, 0, 5);
            $hFin = substr($citaConflicto->hora_fin, 0, 5);

            return "El doctor ya tiene una cita ocupada ({$hInicio} - {$hFin}) con {$pacienteNombre} en esta fecha.";
        }

        return null;
    }

    /**
     * Obtiene el reporte de disponibilidad y citas ocupadas de un doctor.
     */
    public function getDisponibilidadDoctor(
        int $doctorId,
        int $sucursalId,
        string $fecha,
        ?string $horaInicio = null,
        ?string $horaFin = null,
        ?int $ignoreCitaId = null
    ): array {
        $sucursal = Sucursal::find($sucursalId);
        $horarioSucursal = $sucursal ? ($sucursal->horario_atencion ?? '08:00 - 20:00') : '08:00 - 20:00';

        $citasOcupadas = Cita::with(['paciente'])
            ->where('doctor_id', $doctorId)
            ->where('fecha', $fecha)
            ->where('estado', '!=', 'cancelada')
            ->when($ignoreCitaId, function ($query) use ($ignoreCitaId) {
                $query->where('id', '!=', $ignoreCitaId);
            })
            ->orderBy('hora_inicio', 'asc')
            ->get()
            ->map(function ($cita) {
                $paciente = $cita->paciente 
                    ? "{$cita->paciente->nombre} {$cita->paciente->apellido}" 
                    : ($cita->nombre_paciente_unregistered ?? 'No registrado');
                return [
                    'id' => $cita->id,
                    'numero_cita' => $cita->numero_cita,
                    'hora_inicio' => substr($cita->hora_inicio, 0, 5),
                    'hora_fin' => substr($cita->hora_fin, 0, 5),
                    'paciente' => $paciente,
                    'estado' => $cita->estado,
                ];
            });

        $disponible = true;
        $fueraHorarioSucursal = false;
        $conflictoDoctor = false;
        $mensaje = 'El horario está disponible.';

        if ($horaInicio && $horaFin) {
            $errSucursal = $this->validarHorarioSucursal($sucursalId, $horaInicio, $horaFin);
            if ($errSucursal) {
                $disponible = false;
                $fueraHorarioSucursal = true;
                $mensaje = $errSucursal;
            } else {
                $errDoctor = $this->validarTraslapeDoctor($doctorId, $fecha, $horaInicio, $horaFin, $ignoreCitaId);
                if ($errDoctor) {
                    $disponible = false;
                    $conflictoDoctor = true;
                    $mensaje = $errDoctor;
                }
            }
        }

        return [
            'disponible' => $disponible,
            'fuera_horario_sucursal' => $fueraHorarioSucursal,
            'conflicto_doctor' => $conflictoDoctor,
            'horario_sucursal' => $horarioSucursal,
            'citas_ocupadas' => $citasOcupadas,
            'mensaje' => $mensaje,
        ];
    }
}
