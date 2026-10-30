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
        Schema::table('citas', function (Blueprint $table) {
            $table->index(['sucursal_id', 'fecha'], 'citas_sucursal_fecha_idx');
            $table->index(['doctor_id', 'fecha'], 'citas_doctor_fecha_idx');
            $table->index(['estado', 'fecha'], 'citas_estado_fecha_idx');
        });

        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            $table->index(['fecha_emision', 'estado'], 'boletas_fecha_estado_idx');
            $table->index(['doctor_id', 'estado'], 'boletas_doctor_estado_idx');
        });

        Schema::table('proformas', function (Blueprint $table) {
            $table->index(['sucursal_id', 'estado'], 'proformas_sucursal_estado_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->dropIndex('citas_sucursal_fecha_idx');
            $table->dropIndex('citas_doctor_fecha_idx');
            $table->dropIndex('citas_estado_fecha_idx');
        });

        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            $table->dropIndex('boletas_fecha_estado_idx');
            $table->dropIndex('boletas_doctor_estado_idx');
        });

        Schema::table('proformas', function (Blueprint $table) {
            $table->dropIndex('proformas_sucursal_estado_idx');
        });
    }
};
