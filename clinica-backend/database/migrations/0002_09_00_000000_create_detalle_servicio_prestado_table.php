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
        Schema::create('detalle_servicio_prestado', function (Blueprint $table) {
            $table->id();
            $table->foreignId('boleta_servicio_prestado_id')
                  ->constrained('boleta_servicio_prestados')
                  ->cascadeOnDelete();
            $table->foreignId('servicio_id')->constrained('servicios')->restrictOnDelete();
            $table->foreignId('diente_id')->constrained('dientes')->restrictOnDelete();
            $table->text('descripcion')->nullable();
            $table->decimal('descuento', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_servicio_prestado');
    }
};
