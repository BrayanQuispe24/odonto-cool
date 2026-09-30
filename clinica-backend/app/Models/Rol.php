<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rol extends Model
{
    protected $table = 'roles';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nombre',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'rol_id');
    }

    public function rolPermiso(): HasMany
    {
        return $this->hasMany(RolPermiso::class, 'rol_id');
    }
}
