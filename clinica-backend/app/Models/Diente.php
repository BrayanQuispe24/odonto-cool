<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Diente extends Model
{
    use HasFactory;

    protected $table = 'dientes';

    protected $fillable = [
        'numero_diente',
        'nombre',
        'cuadrante',
        'tipo_denticion',
        'descripcion',
        'url',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'numero_diente' => 'integer',
            'estado' => 'boolean',
        ];
    }

    /**
     * Un diente puede estar asociado a múltiples detalles de servicio prestado.
     */
    public function detallesServicioPrestado(): HasMany
    {
        return $this->hasMany(DetalleServicioPrestado::class, 'diente_id');
    }
}
