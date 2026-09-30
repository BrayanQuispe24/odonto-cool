<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expediente extends Model
{
    protected $fillable = [
        'paciente_id',
        'titulo',
        'descripcion',
        'archivo_path',
        'tipo_documento',
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
}
