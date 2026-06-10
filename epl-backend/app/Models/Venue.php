<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    protected $fillable = ['venue_name', 'location'];

    public function matches() { return $this->hasMany(CricketMatch::class); }
}
