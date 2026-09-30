<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Servicio extends Model
{
    use HasFactory;

    protected $table = 'servicios';

    protected $fillable = [
        'codigo_servicio',
        'nombre',
        'descripcion',
        'categoria',
        'precio',
        'duracion_estimada_minutos',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'duracion_estimada_minutos' => 'integer',
            'estado' => 'boolean',
        ];
    }

    /**
     * Un servicio puede incluirse en muchos detalles de servicios prestados.
     */
    public function detallesServicioPrestado(): HasMany
    {
        return $this->hasMany(DetalleServicioPrestado::class, 'servicio_id');
    }
}
