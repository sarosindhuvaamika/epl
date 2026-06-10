<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Teams can participate in multiple tournaments
        Schema::create('tournament_team', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')->constrained('tournaments')->cascadeOnDelete();
            $table->foreignId('team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('group_id')->nullable()->constrained('groups')->nullOnDelete();
            $table->timestamps();
            $table->unique(['tournament_id', 'team_id']);
        });

        // Venues linked to tournaments
        Schema::table('venues', function (Blueprint $table) {
            $table->foreignId('tournament_id')->nullable()->after('location')->constrained('tournaments')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tournament_id');
        });
        Schema::dropIfExists('tournament_team');
    }
};
