<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            $table->dropUnique('boleta_servicio_prestados_cita_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            $table->unique('cita_id', 'boleta_servicio_prestados_cita_id_unique');
        });
    }
};
