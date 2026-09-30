<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Antecedente extends Model
{
    use HasFactory;

    protected $table = 'antecedentes';

    protected $fillable = [
        'paciente_id',
        'tiene_diabetes',
        'descripcion_diabetes',
        'tiene_hipertencion',
        'descripcion_hipertencion',
        'tiene_cancer',
        'descripcion_cancer',
        'tiene_reumatismo',
        'descripcion_reumatismo',
        'tiene_alergias',
        'descripcion_alergias',
        'tiene_gastritis',
        'descripcion_gastritis',
        'otros',
        'esta_siendo_atendido_por_otro_doctor',
        'esta_tomando_algun_medicamento',
        'descripcion_medicamentos',
        'lo_han_intervenido_quirurgicamente',
        'descripcion_intervencion',
        'esta_embarazada',
        'descripcion_embarazo',
    ];

    protected function casts(): array
    {
        return [
            'tiene_diabetes' => 'boolean',
            'tiene_hipertencion' => 'boolean',
            'tiene_cancer' => 'boolean',
            'tiene_reumatismo' => 'boolean',
            'tiene_alergias' => 'boolean',
            'tiene_gastritis' => 'boolean',
            'esta_siendo_atendido_por_otro_doctor' => 'boolean',
            'esta_tomando_algun_medicamento' => 'boolean',
            'lo_han_intervenido_quirurgicamente' => 'boolean',
            'esta_embarazada' => 'boolean',
        ];
    }

    /**
     * Un registro de antecedentes pertenece a un paciente (1:1).
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
