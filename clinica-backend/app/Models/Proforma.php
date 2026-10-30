<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proforma extends Model
{
    use HasFactory;

    protected $table = 'proformas';

    protected $fillable = [
        'codigo_proforma',
        'paciente_id',
        'doctor_id',
        'sucursal_id',
        'nombre',
        'apellido',
        'edad',
        'sexo',
        'celular',
        'fecha_nacimiento',
        'domicilio_actual',
        'fecha_emision',
        'dias_validez',
        'monto_total',
        'estado',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha_nacimiento' => 'date',
            'fecha_emision' => 'date',
            'edad' => 'integer',
            'dias_validez' => 'integer',
            'monto_total' => 'decimal:2',
        ];
    }

    /**
     * Una proforma puede estar vinculada a un paciente existente.
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    /**
     * Una proforma puede ser emitida por un doctor.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    /**
     * Una proforma pertenece a una sucursal.
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    /**
     * Una proforma tiene muchos detalles de servicios cotizados.
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleProforma::class, 'proforma_id');
    }
}
