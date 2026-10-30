<?php

namespace App\Actions\Proforma;

use App\Models\Proforma;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ListProformasAction
{
    public function execute(
        ?int $sucursalId = null,
        ?string $estado = null,
        ?string $search = null,
        ?int $doctorId = null,
        ?string $fechaDesde = null,
        ?string $fechaHasta = null,
        ?int $perPage = null
    ): LengthAwarePaginator|Collection {
        $query = Proforma::with([
            'paciente',
            'doctor.usuario',
            'sucursal',
            'detalles.servicio',
        ]);

        if ($sucursalId) {
            $query->where('sucursal_id', $sucursalId);
        }

        if ($estado && $estado !== 'all') {
            $query->where('estado', $estado);
        }

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        if ($fechaDesde) {
            $query->whereDate('fecha_emision', '>=', $fechaDesde);
        }

        if ($fechaHasta) {
            $query->whereDate('fecha_emision', '<=', $fechaHasta);
        }

        if ($search) {
            $term = '%' . strtolower(trim($search)) . '%';
            $query->where(function ($q) use ($term) {
                $q->whereRaw('LOWER(codigo_proforma) LIKE ?', [$term])
                  ->orWhereRaw('LOWER(nombre) LIKE ?', [$term])
                  ->orWhereRaw('LOWER(apellido) LIKE ?', [$term])
                  ->orWhereRaw('LOWER(celular) LIKE ?', [$term]);
            });
        }

        if ($perPage && $perPage > 0) {
            return $query->orderBy('created_at', 'desc')->paginate($perPage);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }
}
