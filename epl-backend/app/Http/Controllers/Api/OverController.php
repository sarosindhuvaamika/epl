<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Over;
use Illuminate\Http\Request;

class OverController extends Controller
{
    public function index() { return Over::all(); }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        return Over::create($request->only('name'));
    }

    public function update(Request $request, Over $over)
    {
        $request->validate(['name' => 'required|string']);
        $over->update($request->only('name'));
        return $over;
    }

    public function destroy(Over $over)
    {
        $over->delete();
        return response()->noContent();
    }
}
