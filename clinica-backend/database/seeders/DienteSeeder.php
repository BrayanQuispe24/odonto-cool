<?php

namespace Database\Seeders;

use App\Models\Diente;
use Illuminate\Database\Seeder;

class DienteSeeder extends Seeder
{
    public function run(): void
    {
        $dientes = [
            // CUADRANTE 1: Superior Derecho (11 - 18)
            ['numero_diente' => 11, 'nombre' => 'Incisivo Central Superior Derecho', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior central de la arcada superior derecha.'],
            ['numero_diente' => 12, 'nombre' => 'Incisivo Lateral Superior Derecho', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior lateral de la arcada superior derecha.'],
            ['numero_diente' => 13, 'nombre' => 'Canino Superior Derecho', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior de ángulo, guía canina derecha.'],
            ['numero_diente' => 14, 'nombre' => 'Primer Premolar Superior Derecho', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente posterior bicuspídeo superior derecho.'],
            ['numero_diente' => 15, 'nombre' => 'Segundo Premolar Superior Derecho', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente posterior premolar superior derecho.'],
            ['numero_diente' => 16, 'nombre' => 'Primer Molar Superior Derecho', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Molar principal masticatorio superior derecho (Molar de los 6 años).'],
            ['numero_diente' => 17, 'nombre' => 'Segundo Molar Superior Derecho', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Segundo molar posterior superior derecho.'],
            ['numero_diente' => 18, 'nombre' => 'Tercer Molar Superior Derecho (Cordal)', 'cuadrante' => 'Cuadrante 1 - Superior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Muela del juicio superior derecha.'],

            // CUADRANTE 2: Superior Izquierdo (21 - 28)
            ['numero_diente' => 21, 'nombre' => 'Incisivo Central Superior Izquierdo', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior central de la arcada superior izquierda.'],
            ['numero_diente' => 22, 'nombre' => 'Incisivo Lateral Superior Izquierdo', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior lateral de la arcada superior izquierda.'],
            ['numero_diente' => 23, 'nombre' => 'Canino Superior Izquierdo', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior de ángulo, guía canina izquierda.'],
            ['numero_diente' => 24, 'nombre' => 'Primer Premolar Superior Izquierdo', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente posterior bicuspídeo superior izquierdo.'],
            ['numero_diente' => 25, 'nombre' => 'Segundo Premolar Superior Izquierdo', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente posterior premolar superior izquierdo.'],
            ['numero_diente' => 26, 'nombre' => 'Primer Molar Superior Izquierdo', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Molar principal masticatorio superior izquierdo.'],
            ['numero_diente' => 27, 'nombre' => 'Segundo Molar Superior Izquierdo', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Segundo molar posterior superior izquierdo.'],
            ['numero_diente' => 28, 'nombre' => 'Tercer Molar Superior Izquierdo (Cordal)', 'cuadrante' => 'Cuadrante 2 - Superior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Muela del juicio superior izquierda.'],

            // CUADRANTE 3: Inferior Izquierdo (31 - 38)
            ['numero_diente' => 31, 'nombre' => 'Incisivo Central Inferior Izquierdo', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior central de la arcada inferior izquierda.'],
            ['numero_diente' => 32, 'nombre' => 'Incisivo Lateral Inferior Izquierdo', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior lateral de la arcada inferior izquierda.'],
            ['numero_diente' => 33, 'nombre' => 'Canino Inferior Izquierdo', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Canino de la arcada inferior izquierda.'],
            ['numero_diente' => 34, 'nombre' => 'Primer Premolar Inferior Izquierdo', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Primer premolar de la arcada inferior izquierda.'],
            ['numero_diente' => 35, 'nombre' => 'Segundo Premolar Inferior Izquierdo', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Segundo premolar de la arcada inferior izquierda.'],
            ['numero_diente' => 36, 'nombre' => 'Primer Molar Inferior Izquierdo', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Primer molar masticatorio inferior izquierdo.'],
            ['numero_diente' => 37, 'nombre' => 'Segundo Molar Inferior Izquierdo', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Segundo molar posterior inferior izquierdo.'],
            ['numero_diente' => 38, 'nombre' => 'Tercer Molar Inferior Izquierdo (Cordal)', 'cuadrante' => 'Cuadrante 3 - Inferior Izquierdo', 'tipo_denticion' => 'permanente', 'descripcion' => 'Muela del juicio inferior izquierda.'],

            // CUADRANTE 4: Inferior Derecho (41 - 48)
            ['numero_diente' => 41, 'nombre' => 'Incisivo Central Inferior Derecho', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior central de la arcada inferior derecha.'],
            ['numero_diente' => 42, 'nombre' => 'Incisivo Lateral Inferior Derecho', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Diente anterior lateral de la arcada inferior derecha.'],
            ['numero_diente' => 43, 'nombre' => 'Canino Inferior Derecho', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Canino de la arcada inferior derecha.'],
            ['numero_diente' => 44, 'nombre' => 'Primer Premolar Inferior Derecho', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Primer premolar de la arcada inferior derecha.'],
            ['numero_diente' => 45, 'nombre' => 'Segundo Premolar Inferior Derecho', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Segundo premolar de la arcada inferior derecha.'],
            ['numero_diente' => 46, 'nombre' => 'Primer Molar Inferior Derecho', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Primer molar masticatorio inferior derecho.'],
            ['numero_diente' => 47, 'nombre' => 'Segundo Molar Inferior Derecho', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Segundo molar posterior inferior derecho.'],
            ['numero_diente' => 48, 'nombre' => 'Tercer Molar Inferior Derecho (Cordal)', 'cuadrante' => 'Cuadrante 4 - Inferior Derecho', 'tipo_denticion' => 'permanente', 'descripcion' => 'Muela del juicio inferior derecha.'],
        ];

        foreach ($dientes as $data) {
            Diente::firstOrCreate(
                ['numero_diente' => $data['numero_diente']],
                $data
            );
        }
    }
}
