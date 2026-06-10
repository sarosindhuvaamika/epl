<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    protected $fillable = ['season_name'];

    public function tournaments() { return $this->hasMany(Tournament::class); }
}
