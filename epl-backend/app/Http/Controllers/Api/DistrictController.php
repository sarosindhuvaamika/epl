<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\District;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    public function index() { return District::all(); }

    public function store(Request $request)
    {
        $request->validate(['district_name' => 'required']);
        return District::create($request->only('district_name'));
    }

    public function show(District $district) { return $district; }

    public function update(Request $request, District $district)
    {
        $district->update($request->only('district_name'));
        return $district;
    }

    public function destroy(District $district)
    {
        $district->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
