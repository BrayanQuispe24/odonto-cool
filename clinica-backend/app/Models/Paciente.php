<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Paciente extends Model
{
    use HasFactory;

    protected $table = 'pacientes';

    protected $fillable = [
        'codigo_paciente',
        'sucursal_id',
        'nombre',
        'apellido',
        'edad',
        'sexo',
        'ocupacion',
        'estado_civil',
        'celular',
        'domicilio_actual',
        'fecha_nacimiento',
        'telefono_emergencia',
        'nombre_contacto_emergencia',
        'apellido_contacto_emergencia',
        'parentesco_contacto_emergencia',
    ];

    protected function casts(): array
    {
        return [
            'fecha_nacimiento' => 'date',
        ];
    }

    /**
     * Un paciente pertenece a una sucursal.
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    /**
     * Un paciente puede tener muchas citas.
     */
    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class, 'paciente_id');
    }

    /**
     * Un paciente tiene un registro de antecedentes médicos (1:1).
     */
    public function antecedente(): HasOne
    {
        return $this->hasOne(Antecedente::class, 'paciente_id');
    }

    /**
     * Un paciente puede tener muchos expedientes (documentos PDF).
     */
    public function expedientes(): HasMany
    {
        return $this->hasMany(Expediente::class, 'paciente_id');
    }
}
