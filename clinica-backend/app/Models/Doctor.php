<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Doctor extends Model
{
    use HasFactory;

    protected $table = 'doctores';

    protected $fillable = [
        'usuario_id',
        'sucursal_id',
        'nombre',
        'apellido',
        'telefonos',
        'especialidades',
    ];

    protected function casts(): array
    {
        return [
            'telefonos' => 'array',
            'especialidades' => 'array',
        ];
    }

    /**
     * Un doctor pertenece a un usuario de sistema (1:1).
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Un doctor pertenece a una sucursal.
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    /**
     * Un doctor puede atender muchas citas.
     */
    public function citas(): HasMany
    {
        return $this->hasMany(Cita::class, 'doctor_id');
    }
}
