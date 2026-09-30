<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Rol;
use App\Models\Sucursal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $doctorRole = Rol::where('nombre', 'Doctor')->first();
        if (!$doctorRole) {
            $doctorRole = Rol::create(['nombre' => 'Doctor']);
        }

        $sucursalCentral = Sucursal::where('codigo_sucursal', 'SUC-001')->first();
        $sucursalNorte = Sucursal::where('codigo_sucursal', 'SUC-002')->first();

        // Doctor 1: Dr. Carlos Mendoza
        $user1 = User::firstOrCreate(
            ['email' => 'doctor1@clinica.com'],
            [
                'codigo_usuario' => 'DOC-001',
                'password' => Hash::make('doctor123456'),
                'rol_id' => $doctorRole->id,
                'sucursal_id' => $sucursalCentral?->id,
            ]
        );

        Doctor::firstOrCreate(
            ['usuario_id' => $user1->id],
            [
                'sucursal_id' => $sucursalCentral?->id,
                'nombre' => 'Carlos',
                'apellido' => 'Mendoza',
                'telefonos' => ['71234567', '22445566'],
                'especialidades' => ['Ortodoncia', 'Cirugía Maxilofacial'],
            ]
        );

        // Doctor 2: Dra. Ana Silva
        $user2 = User::firstOrCreate(
            ['email' => 'doctor2@clinica.com'],
            [
                'codigo_usuario' => 'DOC-002',
                'password' => Hash::make('doctor123456'),
                'rol_id' => $doctorRole->id,
                'sucursal_id' => $sucursalNorte?->id,
            ]
        );

        Doctor::firstOrCreate(
            ['usuario_id' => $user2->id],
            [
                'sucursal_id' => $sucursalNorte?->id,
                'nombre' => 'Ana',
                'apellido' => 'Silva',
                'telefonos' => ['78901234'],
                'especialidades' => ['Endodoncia', 'Odontopediatría'],
            ]
        );
    }
}
