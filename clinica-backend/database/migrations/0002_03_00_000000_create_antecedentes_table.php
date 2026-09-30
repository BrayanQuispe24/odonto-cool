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
        Schema::create('antecedentes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->unique()->constrained('pacientes')->cascadeOnDelete();
            $table->boolean('tiene_diabetes')->default(false);
            $table->text('descripcion_diabetes')->nullable();
            $table->boolean('tiene_hipertencion')->default(false);
            $table->text('descripcion_hipertencion')->nullable();
            $table->boolean('tiene_cancer')->default(false);
            $table->text('descripcion_cancer')->nullable();
            $table->boolean('tiene_reumatismo')->default(false);
            $table->text('descripcion_reumatismo')->nullable();
            $table->boolean('tiene_alergias')->default(false);
            $table->text('descripcion_alergias')->nullable();
            $table->boolean('tiene_gastritis')->default(false);
            $table->text('descripcion_gastritis')->nullable();
            $table->text('otros')->nullable();
            $table->boolean('esta_siendo_atendido_por_otro_doctor')->default(false);
            $table->boolean('esta_tomando_algun_medicamento')->default(false);
            $table->text('descripcion_medicamentos')->nullable();
            $table->boolean('lo_han_intervenido_quirurgicamente')->default(false);
            $table->text('descripcion_intervencion')->nullable();
            $table->boolean('esta_embarazada')->default(false);
            $table->text('descripcion_embarazo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('antecedentes');
    }
};
