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
            if (Schema::hasColumn('boleta_servicio_prestados', 'metodo_pago')) {
                $table->dropColumn('metodo_pago');
            }
            if (Schema::hasColumn('boleta_servicio_prestados', 'url_comprobante')) {
                $table->dropColumn('url_comprobante');
            }
            if (Schema::hasColumn('boleta_servicio_prestados', 'tipo_paga') && !Schema::hasColumn('boleta_servicio_prestados', 'tipo_pago')) {
                $table->renameColumn('tipo_paga', 'tipo_pago');
            }
        });

        Schema::table('cuotas', function (Blueprint $table) {
            if (!Schema::hasColumn('cuotas', 'numero_cuota')) {
                $table->integer('numero_cuota')->default(1)->after('boleta_servicio_prestado_id');
            }
            if (!Schema::hasColumn('cuotas', 'estado')) {
                $table->string('estado')->default('pendiente')->after('url_comprobante');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boleta_servicio_prestados', function (Blueprint $table) {
            $table->string('metodo_pago')->nullable();
            $table->string('url_comprobante')->nullable();
        });

        Schema::table('cuotas', function (Blueprint $table) {
            if (Schema::hasColumn('cuotas', 'numero_cuota')) {
                $table->dropColumn('numero_cuota');
            }
            if (Schema::hasColumn('cuotas', 'estado')) {
                $table->dropColumn('estado');
            }
        });
    }
};
