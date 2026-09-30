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
        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_servicio')->unique();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('categoria')->default('Odontología General');
            $table->decimal('precio', 10, 2);
            $table->integer('duracion_estimada_minutos')->default(30);
            $table->boolean('estado')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};
