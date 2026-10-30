<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Get default settings for the landing page.
     */
    public static function defaults(): array
    {
        return [
            'hero' => [
                'titulo' => 'Diseñamos tu mejor sonrisa con precisión digital y sin dolor',
                'subtitulo' => 'Tratamientos odontológicos integrales, ortodoncia invisible, implantes de carga inmediata y diseño de sonrisa digital con tecnología clínica de nivel internacional.',
                'cta_texto' => 'Agendar Cita Diagnóstica ➔',
                'secundario_texto' => 'Ver Tratamientos ➔',
                'imagen_url' => '/assets/images/fondolanding.jpeg',
                'stats' => [
                    'pacientes_count' => 3000,
                    'pacientes_label' => 'Pacientes Atendidos',
                    'satisfaccion_count' => 99.5,
                    'satisfaccion_label' => 'Satisfacción Clínica',
                    'experiencia_count' => 4,
                    'experiencia_label' => 'Años Experiencia',
                    'dolor_count' => 0,
                    'dolor_label' => 'Dolor & Sedación',
                ],
            ],
            'contacto' => [
                'whatsapp' => '59178494110',
                'whatsapp_mensaje' => 'Hola, quisiera agendar una cita diagnóstica.',
                'telefono' => '+591 78494110',
                'email' => 'contacto@odontocool.com',
                'direccion' => 'Av. Principal #123, Santa Cruz, Bolivia',
                'horario' => 'Lunes a Sábado: 08:30 - 20:00',
                'facebook_url' => 'https://facebook.com',
                'instagram_url' => 'https://instagram.com',
                'tiktok_url' => 'https://tiktok.com',
            ],
            'secciones_visibles' => [
                'hero' => true,
                'especialidades' => true,
                'doctores' => true,
                'instalaciones' => true,
                'articulos' => true,
                'faqs' => true,
            ],
            'anuncio_top' => [
                'activo' => false,
                'mensaje' => '¡Nueva sucursal disponible! Agenda tu cita con 20% de descuento este mes.',
                'enlace' => '',
            ],
        ];
    }
}
