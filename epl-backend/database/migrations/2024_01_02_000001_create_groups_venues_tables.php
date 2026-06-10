<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_name');
            $table->foreignId('tournament_id')->constrained('tournaments')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('venue_name');
            $table->string('location')->nullable();
            $table->timestamps();
        });

        Schema::table('matches', function (Blueprint $table) {
            $table->foreignId('group_id')->nullable()->after('tournament_id')->constrained('groups')->nullOnDelete();
            $table->foreignId('venue_id')->nullable()->after('venue')->constrained('venues')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropForeign(['venue_id']);
            $table->dropColumn(['group_id', 'venue_id']);
        });
        Schema::dropIfExists('venues');
        Schema::dropIfExists('groups');
    }
};
