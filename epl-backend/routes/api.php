<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminDataController;
use App\Http\Controllers\Api\DistrictController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TournamentController;
use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\Api\VisitorController;
use Illuminate\Support\Facades\Route;

// Visitor tracking (public)
Route::post('/track', [VisitorController::class, 'track']);
Route::post('/heartbeat', [VisitorController::class, 'heartbeat']);
Route::get('/stats', [VisitorController::class, 'stats']);

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/districts', [DistrictController::class, 'index']);
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/teams/{team}', [TeamController::class, 'show']);
Route::get('/players', [PlayerController::class, 'index']);
Route::get('/players/{player}', [PlayerController::class, 'show']);
Route::get('/tournaments', [TournamentController::class, 'index']);
Route::get('/tournaments/{tournament}', [TournamentController::class, 'show']);
Route::get('/matches', [MatchController::class, 'index']);
Route::get('/matches/{match}', [MatchController::class, 'show']);
Route::get('/matches/{match}/scorecard', [MatchController::class, 'scorecard']);
Route::get('/groups', [GroupController::class, 'index']);
Route::get('/groups/{group}', [GroupController::class, 'show']);
Route::get('/venues', [VenueController::class, 'index']);
Route::get('/venues/{venue}', [VenueController::class, 'show']);

// Protected routes (admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/admin/data', [AdminDataController::class, 'index']);

    Route::apiResource('districts', DistrictController::class)->except(['index']);
    Route::apiResource('teams', TeamController::class)->except(['index', 'show']);
    Route::apiResource('players', PlayerController::class)->except(['index', 'show']);
    Route::apiResource('tournaments', TournamentController::class)->except(['index', 'show']);
    Route::apiResource('matches', MatchController::class)->except(['index', 'show']);
    Route::post('/matches/{match}/score', [MatchController::class, 'updateScore']);
    Route::apiResource('groups', GroupController::class)->except(['index', 'show']);
    Route::apiResource('venues', VenueController::class)->except(['index', 'show']);
});
