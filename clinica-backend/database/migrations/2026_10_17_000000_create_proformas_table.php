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
        Schema::create('proformas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_proforma', 20)->unique();
            $table->foreignId('paciente_id')->nullable()->constrained('pacientes')->nullOnDelete();
            $table->foreignId('doctor_id')->nullable()->constrained('doctores')->nullOnDelete();
            $table->foreignId('sucursal_id')->constrained('sucursal')->restrictOnDelete();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->integer('edad');
            $table->string('sexo', 20); // 'M', 'F', 'Otro'
            $table->string('celular', 30);
            $table->date('fecha_nacimiento')->nullable();
            $table->string('domicilio_actual', 255)->nullable();
            $table->date('fecha_emision');
            $table->integer('dias_validez')->default(15);
            $table->decimal('monto_total', 10, 2)->default(0);
            $table->string('estado', 30)->default('Borrador'); // 'Borrador', 'Aprobado', 'Rechazado'
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });

        Schema::create('detalle_proformas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proforma_id')->constrained('proformas')->cascadeOnDelete();
            $table->foreignId('servicio_id')->constrained('servicios')->restrictOnDelete();
            $table->string('nombre_servicio', 150);
            $table->decimal('precio', 10, 2)->default(0);
            $table->decimal('descuento', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_proformas');
        Schema::dropIfExists('proformas');
    }
};
