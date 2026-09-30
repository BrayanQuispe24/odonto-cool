<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleServicioPrestado extends Model
{
    use HasFactory;

    protected $table = 'detalle_servicio_prestado';

    protected $fillable = [
        'boleta_servicio_prestado_id',
        'servicio_id',
        'diente_id',
        'descripcion',
        'descuento',
    ];

    protected function casts(): array
    {
        return [
            'descuento' => 'decimal:2',
        ];
    }

    /**
     * El detalle pertenece a una boleta de servicio prestado.
     */
    public function boletaServicioPrestado(): BelongsTo
    {
        return $this->belongsTo(BoletaServicioPrestado::class, 'boleta_servicio_prestado_id');
    }

    /**
     * El detalle hace referencia a un servicio.
     */
    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }

    /**
     * El detalle está asociado a un diente específico.
     */
    public function diente(): BelongsTo
    {
        return $this->belongsTo(Diente::class, 'diente_id');
    }
}
