<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permiso extends Model
{
    use HasFactory;

    protected $table = 'permisos';

    protected $fillable = [
        'nombre_permiso',
        'modulo_id',
    ];

    /**
     * Un permiso pertenece a un módulo.
     */
    public function modulo(): BelongsTo
    {
        return $this->belongsTo(Modulo::class, 'modulo_id');
    }

    /**
     * Un permiso pertenece a muchos roles (tabla pivote rol_permiso).
     */
    public function rolPermiso(): HasMany
    {
        return $this->hasMany(RolPermiso::class, 'permiso_id');
    }
}
