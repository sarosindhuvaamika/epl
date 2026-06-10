<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    protected $fillable = ['name', 'district_id', 'start_date', 'end_date', 'status'];

    public function district() { return $this->belongsTo(District::class); }
    public function matches() { return $this->hasMany(CricketMatch::class, 'tournament_id'); }
    public function groups() { return $this->hasMany(Group::class); }
}
