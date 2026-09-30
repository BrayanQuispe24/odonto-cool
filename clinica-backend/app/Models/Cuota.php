<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cuota extends Model
{
    use HasFactory;

    protected $table = 'cuotas';

    protected $fillable = [
        'boleta_servicio_prestado_id',
        'numero_cuota',
        'fecha_pago',
        'modo_pago',
        'monto_cuota',
        'metodo_pago',
        'url_comprobante',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_pago' => 'date',
            'monto_cuota' => 'decimal:2',
        ];
    }

    /**
     * Una cuota pertenece a una boleta de servicio prestado.
     */
    public function boletaServicioPrestado(): BelongsTo
    {
        return $this->belongsTo(BoletaServicioPrestado::class, 'boleta_servicio_prestado_id');
    }
}
