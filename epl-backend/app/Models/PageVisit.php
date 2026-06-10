<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVisit extends Model
{
    protected $fillable = ['page_path', 'session_id', 'ip_address', 'user_agent'];
}
