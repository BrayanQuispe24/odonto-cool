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
            $table->foreignId('paciente_id')->nullable()->constrained('pacientes')->nullOnDelete()->after('doctor_id');
            $table->unsignedBigInteger('cita_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            $table->dropForeign(['paciente_id']);
            $table->dropColumn('paciente_id');
            $table->unsignedBigInteger('cita_id')->nullable(false)->change();
        });
    }
};
