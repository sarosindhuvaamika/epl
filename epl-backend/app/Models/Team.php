<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['team_name', 'team_logo', 'district_id'];

    public function district() { return $this->belongsTo(District::class); }
    public function players() { return $this->hasMany(Player::class); }
    public function tournaments() { return $this->belongsToMany(Tournament::class, 'tournament_team')->withPivot('group_id'); }
}
