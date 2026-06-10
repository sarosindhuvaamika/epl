<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CricketMatch extends Model
{
    protected $table = 'matches';
    protected $fillable = ['tournament_id', 'group_id', 'team_a_id', 'team_b_id', 'match_date', 'venue', 'venue_id', 'overs', 'match_level_id', 'toss_won_by', 'toss_decision', 'winner_team_id', 'status'];

    public function matchLevel() { return $this->belongsTo(MatchLevel::class); }

    public function tournament() { return $this->belongsTo(Tournament::class); }
    public function group() { return $this->belongsTo(Group::class); }
    public function venueInfo() { return $this->belongsTo(Venue::class, 'venue_id'); }
    public function teamA() { return $this->belongsTo(Team::class, 'team_a_id'); }
    public function teamB() { return $this->belongsTo(Team::class, 'team_b_id'); }
    public function winner() { return $this->belongsTo(Team::class, 'winner_team_id'); }
    public function innings() { return $this->hasMany(PlayerInnings::class, 'match_id'); }
}
