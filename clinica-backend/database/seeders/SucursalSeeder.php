<?php

namespace Database\Seeders;

use App\Models\Sucursal;
use Illuminate\Database\Seeder;

class SucursalSeeder extends Seeder
{
    public function run(): void
    {
        Sucursal::firstOrCreate(
            ['codigo_sucursal' => 'SUC-001'],
            [
                'nombre' => 'Sucursal Central Matrix',
                'ubicacion' => 'Sede Principal - Av. Central 456',
                'telefono' => '(02) 294-8500',
                'horario_atencion' => '08:00 - 20:00',
                'estado' => true,
            ]
        );

        Sucursal::firstOrCreate(
            ['codigo_sucursal' => 'SUC-002'],
            [
                'nombre' => 'Sucursal Norte Medical',
                'ubicacion' => 'Sede Norte - Av. Las Flores 789',
                'telefono' => '(02) 294-9000',
                'horario_atencion' => '08:00 - 18:00',
                'estado' => true,
            ]
        );
    }
}
