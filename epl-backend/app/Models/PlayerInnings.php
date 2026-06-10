<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlayerInnings extends Model
{
    protected $fillable = [
        'match_id', 'player_id', 'team_id', 'innings_number',
        'runs_scored', 'balls_faced', 'fours', 'sixes', 'how_out', 'bowler_id', 'fielder_id',
        'overs_bowled', 'maidens', 'runs_conceded', 'wickets_taken', 'wides', 'no_balls',
        'catches', 'stumpings', 'run_outs'
    ];

    public function match() { return $this->belongsTo(CricketMatch::class, 'match_id'); }
    public function player() { return $this->belongsTo(Player::class); }
    public function team() { return $this->belongsTo(Team::class); }
}
