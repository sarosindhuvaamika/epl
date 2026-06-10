<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index() { return Player::with('team')->get(); }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'phone_no' => 'required']);
        return Player::create($request->only('name', 'emp_id', 'email_id', 'phone_no', 'team_id'));
    }

    public function show(Player $player) { return $player->load('team'); }

    public function update(Request $request, Player $player)
    {
        $player->update($request->only('name', 'emp_id', 'email_id', 'phone_no', 'team_id'));
        return $player;
    }

    public function destroy(Player $player)
    {
        $player->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
