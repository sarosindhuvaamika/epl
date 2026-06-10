<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MatchLevel;
use Illuminate\Http\Request;

class MatchLevelController extends Controller
{
    public function index() { return MatchLevel::all(); }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:match_levels,name']);
        return MatchLevel::create($request->only('name'));
    }

    public function update(Request $request, MatchLevel $matchLevel)
    {
        $request->validate(['name' => 'required|string']);
        $matchLevel->update($request->only('name'));
        return $matchLevel;
    }

    public function destroy(MatchLevel $matchLevel)
    {
        $matchLevel->delete();
        return response()->noContent();
    }
}
