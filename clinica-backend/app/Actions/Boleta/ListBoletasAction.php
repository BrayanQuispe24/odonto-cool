<?php

namespace App\Actions\Boleta;

use App\Models\BoletaServicioPrestado;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ListBoletasAction
{
    public function execute(?int $citaId = null, ?int $doctorId = null, ?int $pacienteId = null, ?string $estado = null, ?int $sucursalId = null, ?int $perPage = null): LengthAwarePaginator|Collection
    {
        $query = BoletaServicioPrestado::with([
            'cita.doctor.usuario',
            'cita.paciente',
            'cita.sucursal',
            'doctor.usuario',
            'doctor.sucursal',
            'paciente',
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
            $query->where(function ($q) use ($pacienteId) {
                $q->where('paciente_id', $pacienteId)
                  ->orWhereHas('cita', function ($qc) use ($pacienteId) {
                      $qc->where('paciente_id', $pacienteId);
                  });
            });
        }

        if ($estado) {
            $query->where('estado', $estado);
        }

        if ($sucursalId) {
            $query->where(function ($sub) use ($sucursalId) {
                $sub->whereHas('cita', function ($q) use ($sucursalId) {
                    $q->where('sucursal_id', $sucursalId);
                })->orWhere(function ($q2) use ($sucursalId) {
                    $q2->whereNull('cita_id')
                       ->whereHas('doctor', function ($d) use ($sucursalId) {
                           $d->where('sucursal_id', $sucursalId);
                       });
                });
            });
        }

        if ($perPage && $perPage > 0) {
            return $query->orderBy('created_at', 'desc')->paginate($perPage);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
