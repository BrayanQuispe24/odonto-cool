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
            if (!Schema::hasColumn('boleta_servicio_prestados', 'doctor_id')) {
                $table->foreignId('doctor_id')->nullable()->after('cita_id')->constrained('doctores')->nullOnDelete();
            }
        });

        Schema::table('detalle_servicio_prestado', function (Blueprint $table) {
            $table->foreignId('diente_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            if (Schema::hasColumn('boleta_servicio_prestados', 'doctor_id')) {
                $table->dropForeign(['doctor_id']);
                $table->dropColumn('doctor_id');
            }
        });

        Schema::table('detalle_servicio_prestado', function (Blueprint $table) {
            $table->foreignId('diente_id')->nullable(false)->change();
        });
    }
};
