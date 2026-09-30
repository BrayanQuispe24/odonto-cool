<?php

namespace App\Actions\Cita;

use App\Models\Cita;
use Illuminate\Database\Eloquent\Collection;

class ListCitasAction
{
    public function execute(?int $sucursalId = null, ?int $doctorId = null, ?string $fecha = null, ?string $estado = null): Collection
    {
        $query = Cita::with([
            'doctor.usuario',
            'sucursal',
            'paciente',
            'boletaServicioPrestado'
        ]);

        if ($sucursalId) {
            $query->where('sucursal_id', $sucursalId);
        }

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        if ($fecha) {
            $query->whereDate('fecha', $fecha);
        }

        if ($estado) {
            $query->where('estado', $estado);
        }

        return $query->orderBy('fecha', 'desc')->orderBy('hora_inicio', 'asc')->get();
    }
}
