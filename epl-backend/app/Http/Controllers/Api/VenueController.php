<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    public function index() { return Venue::all(); }

    public function store(Request $request)
    {
        $request->validate(['venue_name' => 'required|unique:venues,venue_name']);
        return Venue::create($request->only('venue_name', 'location', 'tournament_id'));
    }

    public function show(Venue $venue) { return $venue; }

    public function update(Request $request, Venue $venue)
    {
        $venue->update($request->only('venue_name', 'location'));
        return $venue;
    }

    public function destroy(Venue $venue)
    {
        $venue->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
