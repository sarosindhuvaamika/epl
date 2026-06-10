<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = ['group_name', 'tournament_id'];

    public function tournament() { return $this->belongsTo(Tournament::class); }
    public function matches() { return $this->hasMany(CricketMatch::class); }
}
