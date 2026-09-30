<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sucursal extends Model
{
    use HasFactory;

    protected $table = 'sucursal';

    protected $fillable = [
        'codigo_sucursal',
        'nombre',
        'ubicacion',
        'telefono',
        'horario_atencion',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    /**
     * Una sucursal tiene muchos doctores.
     */
    public function doctores(): HasMany
    {
        return $this->hasMany(Doctor::class, 'sucursal_id');
    }

    /**
     * Una sucursal tiene muchas citas.
     */
    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class, 'sucursal_id');
    }

    /**
     * Una sucursal tiene muchos pacientes registrados.
     */
    public function pacientes(): HasMany
    {
        return $this->hasMany(Paciente::class, 'sucursal_id');
    }

    /**
     * Una sucursal tiene muchos usuarios.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'sucursal_id');
    }
}
