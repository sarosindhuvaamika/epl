<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index() { return Group::with('tournament')->get(); }

    public function store(Request $request)
    {
        $request->validate([
            'group_name' => 'required',
            'tournament_id' => 'required|exists:tournaments,id',
        ]);
        return Group::create($request->only('group_name', 'tournament_id'));
    }

    public function show(Group $group) { return $group->load('tournament', 'matches'); }

    public function update(Request $request, Group $group)
    {
        $group->update($request->only('group_name', 'tournament_id'));
        return $group;
    }

    public function destroy(Group $group)
    {
        $group->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
