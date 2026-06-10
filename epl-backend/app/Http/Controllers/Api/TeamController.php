<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index() { return Team::with('district')->get(); }

    public function store(Request $request)
    {
        $request->validate(['team_name' => 'required']);
        $data = $request->only('team_name', 'district_id');
        if ($request->hasFile('team_logo')) {
            $data['team_logo'] = $request->file('team_logo')->store('team_logos', 'public');
        }
        return Team::create($data);
    }

    public function show(Team $team) { return $team->load('district', 'players'); }

    public function update(Request $request, Team $team)
    {
        $data = $request->only('team_name', 'district_id');
        if ($request->hasFile('team_logo')) {
            $data['team_logo'] = $request->file('team_logo')->store('team_logos', 'public');
        }
        $team->update($data);
        return $team;
    }

    public function destroy(Team $team)
    {
        $team->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
