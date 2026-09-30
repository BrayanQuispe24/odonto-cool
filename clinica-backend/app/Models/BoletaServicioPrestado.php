<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoletaServicioPrestado extends Model
{
    use HasFactory;

    protected $table = 'boleta_servicio_prestados';

    protected $fillable = [
        'cita_id',
        'doctor_id',
        'fecha_emision',
        'numero_boleta',
        'emitido_por',
        'monto_total',
        'tipo_pago',
        'cantidad_cuotas',
        'porcentaje_comision_dr',
        'monto_comision_dr',
        'costo_laboratorio',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_emision' => 'date',
            'monto_total' => 'decimal:2',
            'porcentaje_comision_dr' => 'decimal:2',
            'monto_comision_dr' => 'decimal:2',
            'costo_laboratorio' => 'decimal:2',
            'cantidad_cuotas' => 'integer',
        ];
    }

    /**
     * Una boleta pertenece a una sola cita.
     */
    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'cita_id');
    }

    /**
     * Una boleta está asociada directamente a un doctor.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    /**
     * Una boleta contiene múltiples detalles de servicio prestado.
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleServicioPrestado::class, 'boleta_servicio_prestado_id');
    }

    /**
     * Una boleta puede fraccionarse en múltiples cuotas.
     */
    public function cuotas(): HasMany
    {
        return $this->hasMany(Cuota::class, 'boleta_servicio_prestado_id');
    }
}
