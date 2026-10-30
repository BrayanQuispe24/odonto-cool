<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleProforma extends Model
{
    use HasFactory;

    protected $table = 'detalle_proformas';

    protected $fillable = [
        'proforma_id',
        'servicio_id',
        'nombre_servicio',
        'precio',
        'descuento',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'descuento' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    /**
     * El detalle pertenece a una proforma.
     */
    public function proforma(): BelongsTo
    {
        return $this->belongsTo(Proforma::class, 'proforma_id');
    }

    /**
     * El detalle hace referencia a un servicio del catálogo.
     */
    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }
}
