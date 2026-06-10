<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    protected $fillable = ['venue_name', 'location', 'tournament_id'];

    public function tournament() { return $this->belongsTo(Tournament::class); }
    public function matches() { return $this->hasMany(CricketMatch::class); }
}
