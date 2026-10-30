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
        Schema::table('servicios', function (Blueprint $table) {
            $table->boolean('destacado_en_landing')->default(true)->after('estado');
        });

        Schema::table('doctores', function (Blueprint $table) {
            $table->boolean('destacado_en_landing')->default(true)->after('especialidades');
            $table->text('bio_landing')->nullable()->after('destacado_en_landing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('servicios', function (Blueprint $table) {
            $table->dropColumn('destacado_en_landing');
        });

        Schema::table('doctores', function (Blueprint $table) {
            $table->dropColumn(['destacado_en_landing', 'bio_landing']);
        });
    }
};
