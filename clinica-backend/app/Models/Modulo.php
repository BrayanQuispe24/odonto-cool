<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Modulo extends Model
{
    use HasFactory;

    protected $table = 'modulo';

    protected $fillable = [
        'nombre_modulo',
    ];

    /**
     * Un módulo tiene muchos permisos.
     */
    public function permisos(): HasMany
    {
        return $this->hasMany(Permiso::class, 'modulo_id');
    }
}
