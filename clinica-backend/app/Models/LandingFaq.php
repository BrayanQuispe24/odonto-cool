<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingFaq extends Model
{
    protected $fillable = [
        'pregunta',
        'respuesta',
        'orden',
        'estado',
    ];

    protected $casts = [
        'orden' => 'integer',
        'estado' => 'boolean',
    ];

    /**
     * Default FAQs to seed if the table is empty.
     */
    public static function defaultFaqs(): array
    {
        return [
            [
                'pregunta' => '¿Cómo puedo agendar mi primera cita de valoración?',
                'respuesta' => 'Puedes agendar directamente haciendo clic en nuestros botones de reserva, comunicándote por WhatsApp al número de atención o llamando a nuestra central.',
                'orden' => 1,
                'estado' => true,
            ],
            [
                'pregunta' => '¿Aceptan seguros médicos o convenios dentales?',
                'respuesta' => 'Sí. Trabajamos con los principales seguros médicos y prepagadas del país. Te ayudamos a gestionar la documentación necesaria para la cobertura o reembolso directo.',
                'orden' => 2,
                'estado' => true,
            ],
            [
                'pregunta' => '¿Los tratamientos causan dolor o molestias posteriores?',
                'respuesta' => 'No. Contamos con tecnología de anestesia digital computarizada sin aguja tradicional y protocolos de sedación consciente para que tu tratamiento sea 100% cómodo.',
                'orden' => 3,
                'estado' => true,
            ],
            [
                'pregunta' => '¿Qué incluye la consulta diagnóstica inicial?',
                'respuesta' => 'Tu primera evaluación incluye diagnóstico clínico integral por especialista, tomografía/radiografía panorámica digital y un plan de tratamiento detallado sin compromiso.',
                'orden' => 4,
                'estado' => true,
            ],
            [
                'pregunta' => '¿Atienden emergencias dentales el mismo día?',
                'respuesta' => 'Sí, contamos con un turno prioritario de emergencia para atender dolores agudos, traumatismos o fracturas dentales el mismo día que lo solicites.',
                'orden' => 5,
                'estado' => true,
            ],
        ];
    }
}
