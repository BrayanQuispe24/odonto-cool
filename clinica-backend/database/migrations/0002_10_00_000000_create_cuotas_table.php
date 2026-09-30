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
        Schema::create('cuotas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('boleta_servicio_prestado_id')
                ->constrained('boleta_servicio_prestados')
                ->cascadeOnDelete();
            $table->date('fecha_pago')->nullable();
            $table->string('modo_pago')->nullable();
            $table->decimal('monto_cuota', 12, 2);
            $table->string('metodo_pago')->nullable();
            $table->string('url_comprobante')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuotas');
    }
};
