<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;

class TournamentController extends Controller
{
    public function index() { return Tournament::with('district')->get(); }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        return Tournament::create($request->only('name', 'district_id', 'start_date', 'end_date', 'status'));
    }

    public function show(Tournament $tournament) { return $tournament->load('district', 'matches.teamA', 'matches.teamB', 'groups', 'teams', 'venues'); }

    public function update(Request $request, Tournament $tournament)
    {
        $tournament->update($request->only('name', 'district_id', 'start_date', 'end_date', 'status'));
        return $tournament;
    }

    public function destroy(Tournament $tournament)
    {
        $tournament->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function teams(Tournament $tournament)
    {
        return $tournament->teams()->with('district')->get();
    }

    public function addTeam(Request $request, Tournament $tournament)
    {
        $request->validate(['team_id' => 'required|exists:teams,id']);
        $tournament->teams()->syncWithoutDetaching([$request->team_id => ['group_id' => $request->group_id]]);
        return response()->json(['message' => 'Team added']);
    }

    public function removeTeam(Tournament $tournament, $team)
    {
        $tournament->teams()->detach($team);
        return response()->json(['message' => 'Team removed']);
    }
}
