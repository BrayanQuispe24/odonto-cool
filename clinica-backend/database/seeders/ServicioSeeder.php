<?php

namespace Database\Seeders;

use App\Models\Servicio;
use Illuminate\Database\Seeder;

class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        $servicios = [
            [
                'codigo_servicio' => 'SERV-001',
                'nombre' => 'Profilaxis y Limpieza Ultrasonido',
                'descripcion' => 'Limpieza dental profunda con ultrasonido, eliminación de sarro, placa bacteriana y pulido coronario.',
                'categoria' => 'Odontología General',
                'precio' => 150.00,
                'duracion_estimada_minutos' => 45,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-002',
                'nombre' => 'Restauración Estética con Resina Fotocurable',
                'descripcion' => 'Obturación estética en pieza dental afectada por caries o fractura con resina nanohíbrida.',
                'categoria' => 'Odontología General',
                'precio' => 220.00,
                'duracion_estimada_minutos' => 45,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-003',
                'nombre' => 'Tratamiento de Conducto Unirradicular (Endodoncia)',
                'descripcion' => 'Endodoncia mecanizada en dientes uniconductos (incisivos o caninos), incluye instrumentación y obturación.',
                'categoria' => 'Endodoncia',
                'precio' => 450.00,
                'duracion_estimada_minutos' => 60,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-004',
                'nombre' => 'Tratamiento de Conducto Multirradicular (Endodoncia)',
                'descripcion' => 'Endodoncia mecanizada en molares o premolares de 2 a 4 conductos.',
                'categoria' => 'Endodoncia',
                'precio' => 650.00,
                'duracion_estimada_minutos' => 90,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-005',
                'nombre' => 'Blanqueamiento Dental Láser / LED',
                'descripcion' => 'Aclaramiento dental profesional en consultorio con gel activado por luz LED en 3 sesiones de 15 min.',
                'categoria' => 'Estética Dental',
                'precio' => 800.00,
                'duracion_estimada_minutos' => 60,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-006',
                'nombre' => 'Extracción Dental Simple',
                'descripcion' => 'Exodoncia de pieza dental erupcionada bajo anestesia local.',
                'categoria' => 'Cirugía',
                'precio' => 180.00,
                'duracion_estimada_minutos' => 30,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-007',
                'nombre' => 'Cirugía de Muela del Juicio (Tercer Molar Retenido)',
                'descripcion' => 'Exodoncia quirúrgica compleja de cordales impactadas o retenidas con osteotomía y sutura.',
                'categoria' => 'Cirugía',
                'precio' => 450.00,
                'duracion_estimada_minutos' => 75,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-008',
                'nombre' => 'Instalación de Brackets Metálicos (Ortodoncia)',
                'descripcion' => 'Colocación de aparatología fija metálica superior e inferior con arcos iniciales.',
                'categoria' => 'Ortodoncia',
                'precio' => 1200.00,
                'duracion_estimada_minutos' => 90,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-009',
                'nombre' => 'Control Mensual y Ajuste de Ortodoncia',
                'descripcion' => 'Control periódico de ortodoncia, cambio de ligaduras, arcos y activación de fuerzas.',
                'categoria' => 'Ortodoncia',
                'precio' => 250.00,
                'duracion_estimada_minutos' => 30,
                'estado' => true,
            ],
            [
                'codigo_servicio' => 'SERV-0010',
                'nombre' => 'Corona Estética de Zirconio Monolítico',
                'descripcion' => 'Prótesis fija libre de metal de alta resistencia y estética en zirconio CAD/CAM.',
                'categoria' => 'Rehabilitación Oral',
                'precio' => 1100.00,
                'duracion_estimada_minutos' => 60,
                'estado' => true,
            ],
        ];

        foreach ($servicios as $data) {
            Servicio::firstOrCreate(
                ['codigo_servicio' => $data['codigo_servicio']],
                $data
            );
        }
    }
}
