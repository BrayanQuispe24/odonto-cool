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
        Schema::create('dientes', function (Blueprint $table) {
            $table->id();
            $table->integer('numero_diente')->unique();
            $table->string('nombre');
            $table->string('cuadrante')->nullable();
            $table->enum('tipo_denticion', ['permanente', 'deciduo'])->default('permanente');
            $table->text('descripcion')->nullable();
            $table->string('url')->nullable();
            $table->boolean('estado')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dientes');
    }
};
