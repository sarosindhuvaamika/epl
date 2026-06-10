<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Season;
use Illuminate\Http\Request;

class SeasonController extends Controller
{
    public function index() { return Season::all(); }

    public function store(Request $request)
    {
        $request->validate(['season_name' => 'required']);
        return Season::create($request->only('season_name'));
    }

    public function show(Season $season) { return $season; }

    public function update(Request $request, Season $season)
    {
        $season->update($request->only('season_name'));
        return $season;
    }

    public function destroy(Season $season)
    {
        $season->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
