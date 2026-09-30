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
        Schema::create('boleta_servicio_prestados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cita_id')->unique()->constrained('citas')->restrictOnDelete();
            $table->date('fecha_emision');
            $table->string('numero_boleta')->unique();
            $table->string('emitido_por');
            $table->decimal('monto_total', 12, 2);
            $table->string('tipo_paga');
            $table->unsignedInteger('cantidad_cuotas')->default(1);
            $table->string('metodo_pago');
            $table->string('url_comprobante')->nullable();
            $table->string('estado')->default('emitida');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boleta_servicio_prestados');
    }
};
