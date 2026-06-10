<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('phone_no', 15);
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->timestamps();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->string('district_name');
            $table->timestamps();
        });

        Schema::create('seasons', function (Blueprint $table) {
            $table->id();
            $table->string('season_name');
            $table->timestamps();
        });

        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('team_name');
            $table->string('team_logo')->nullable();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('emp_id')->nullable();
            $table->string('email_id')->nullable();
            $table->string('phone_no', 15);
            $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('season_id')->constrained('seasons')->cascadeOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['upcoming', 'ongoing', 'completed'])->default('upcoming');
            $table->timestamps();
        });

        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tournament_id')->constrained('tournaments')->cascadeOnDelete();
            $table->foreignId('team_a_id')->constrained('teams');
            $table->foreignId('team_b_id')->constrained('teams');
            $table->date('match_date')->nullable();
            $table->string('venue')->nullable();
            $table->integer('overs')->default(20);
            $table->enum('toss_won_by', ['team_a', 'team_b'])->nullable();
            $table->enum('toss_decision', ['bat', 'bowl'])->nullable();
            $table->foreignId('winner_team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->enum('status', ['upcoming', 'live', 'completed'])->default('upcoming');
            $table->timestamps();
        });

        Schema::create('player_innings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->foreignId('player_id')->constrained('players')->cascadeOnDelete();
            $table->foreignId('team_id')->constrained('teams');
            $table->tinyInteger('innings_number')->default(1);
            // Batting
            $table->integer('runs_scored')->default(0);
            $table->integer('balls_faced')->default(0);
            $table->integer('fours')->default(0);
            $table->integer('sixes')->default(0);
            $table->string('how_out')->nullable(); // bowled, caught, lbw, run_out, stumped, not_out, etc.
            $table->foreignId('bowler_id')->nullable()->constrained('players')->nullOnDelete();
            $table->foreignId('fielder_id')->nullable()->constrained('players')->nullOnDelete();
            // Bowling
            $table->decimal('overs_bowled', 4, 1)->default(0);
            $table->integer('maidens')->default(0);
            $table->integer('runs_conceded')->default(0);
            $table->integer('wickets_taken')->default(0);
            $table->integer('wides')->default(0);
            $table->integer('no_balls')->default(0);
            // Fielding
            $table->integer('catches')->default(0);
            $table->integer('stumpings')->default(0);
            $table->integer('run_outs')->default(0);
            $table->timestamps();
        });

        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('player_innings');
        Schema::dropIfExists('matches');
        Schema::dropIfExists('tournaments');
        Schema::dropIfExists('players');
        Schema::dropIfExists('teams');
        Schema::dropIfExists('seasons');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('users');
    }
};
