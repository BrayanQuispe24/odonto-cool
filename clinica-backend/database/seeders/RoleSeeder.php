<?php

namespace Database\Seeders;

use App\Models\Rol;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Rol::firstOrCreate(['nombre' => 'Administrador']);
        $doctorRole = Rol::firstOrCreate(['nombre' => 'Doctor']);
        Rol::firstOrCreate(['nombre' => 'Paciente']);

        User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'codigo_usuario' => 'ADM-001',
                'password' => Hash::make('admin123456'),
                'rol_id' => $adminRole->id,
            ]
        );
    }
}
