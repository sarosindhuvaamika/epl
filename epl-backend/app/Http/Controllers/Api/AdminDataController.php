<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CricketMatch;
use App\Models\District;
use App\Models\Group;
use App\Models\Player;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\Venue;

class AdminDataController extends Controller
{
    public function index()
    {
        return response()->json([
            'districts' => District::all(),
            'teams' => Team::with('district')->get(),
            'players' => Player::with('team')->get(),
            'tournaments' => Tournament::with('district')->get(),
            'matches' => CricketMatch::with('teamA', 'teamB', 'tournament', 'winner', 'group', 'venueInfo')->get(),
            'groups' => Group::with('tournament')->get(),
            'venues' => Venue::all(),
        ]);
    }
}
