<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consejo extends Model
{
    protected $fillable = [
        'titulo',
        'categoria',
        'descripcion',
        'imagen_url',
        'estado'
    ];
}
