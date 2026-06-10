<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropForeign(['season_id']);
            $table->dropColumn('season_id');
        });

        Schema::dropIfExists('seasons');
    }

    public function down(): void
    {
        Schema::create('seasons', function (Blueprint $table) {
            $table->id();
            $table->string('season_name');
            $table->timestamps();
        });

        Schema::table('tournaments', function (Blueprint $table) {
            $table->foreignId('season_id')->nullable()->constrained('seasons')->cascadeOnDelete();
        });
    }
};
