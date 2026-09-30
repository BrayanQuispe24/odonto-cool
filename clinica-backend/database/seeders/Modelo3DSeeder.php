<?php

namespace Database\Seeders;

use App\Models\Modelo3D;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class Modelo3DSeeder extends Seeder
{
    /**
     * Seed the default 3D GLB models.
     */
    public function run(): void
    {
        $teeth1Path = storage_path('app/public/modelos_3d/teeth1.glb');
        $teeth2Path = storage_path('app/public/modelos_3d/teeth2.glb');

        $teeth1Size = File::exists($teeth1Path) ? File::size($teeth1Path) : 15577664;
        $teeth2Size = File::exists($teeth2Path) ? File::size($teeth2Path) : 13533220;

        Modelo3D::updateOrCreate(
            ['archivo_path' => 'modelos_3d/teeth1.glb'],
            [
                'nombre' => 'Modelo 1: Arcada Completa Maxilar & Mandibular',
                'descripcion' => 'Modelo tridimensional predeterminado de arcada completa.',
                'tamanio_bytes' => $teeth1Size,
                'mime_type' => 'model/gltf-binary',
                'activo' => true,
            ]
        );

        Modelo3D::updateOrCreate(
            ['archivo_path' => 'modelos_3d/teeth2.glb'],
            [
                'nombre' => 'Modelo 2: Detalle Anatómico Superior',
                'descripcion' => 'Modelo tridimensional predeterminado de arcada superior en alta resolución.',
                'tamanio_bytes' => $teeth2Size,
                'mime_type' => 'model/gltf-binary',
                'activo' => true,
            ]
        );
    }
}
