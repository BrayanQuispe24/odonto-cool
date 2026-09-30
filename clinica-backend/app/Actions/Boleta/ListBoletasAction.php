<?php

namespace App\Actions\Boleta;

use App\Models\BoletaServicioPrestado;
use Illuminate\Database\Eloquent\Collection;

class ListBoletasAction
{
    public function execute(?int $citaId = null, ?int $doctorId = null, ?int $pacienteId = null, ?string $estado = null, ?int $sucursalId = null): Collection
    {
        $query = BoletaServicioPrestado::with([
            'cita.doctor.usuario',
            'cita.paciente',
            'cita.sucursal',
            'doctor.usuario',
            'detalles.servicio',
            'detalles.diente',
            'cuotas',
        ]);

        if ($citaId) {
            $query->where('cita_id', $citaId);
        }

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        if ($pacienteId) {
            $query->whereHas('cita', function ($q) use ($pacienteId) {
                $q->where('paciente_id', $pacienteId);
            });
        }

        if ($estado) {
            $query->where('estado', $estado);
        }

        if ($sucursalId) {
            $query->whereHas('cita', function ($q) use ($sucursalId) {
                $q->where('sucursal_id', $sucursalId);
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
