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
            $table->decimal('porcentaje_comision_dr', 5, 2)->default(40.00)->after('metodo_pago');
            $table->decimal('monto_comision_dr', 12, 2)->default(0.00)->after('porcentaje_comision_dr');
            $table->decimal('costo_laboratorio', 12, 2)->default(0.00)->after('monto_comision_dr');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            $table->dropColumn(['porcentaje_comision_dr', 'monto_comision_dr', 'costo_laboratorio']);
        });
    }
};
