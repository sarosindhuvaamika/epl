<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CricketMatch;
use App\Models\PlayerInnings;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index() { return CricketMatch::with('teamA', 'teamB', 'tournament', 'winner', 'group', 'venueInfo')->get(); }

    public function store(Request $request)
    {
        $request->validate([
            'tournament_id' => 'required|exists:tournaments,id',
            'team_a_id' => 'required|exists:teams,id',
            'team_b_id' => 'required|exists:teams,id',
        ]);
        return CricketMatch::create($request->only('tournament_id', 'group_id', 'team_a_id', 'team_b_id', 'match_date', 'venue', 'venue_id', 'overs', 'toss_won_by', 'toss_decision', 'status'));
    }

    public function show(CricketMatch $match)
    {
        return $match->load('teamA.players', 'teamB.players', 'tournament', 'innings.player', 'group', 'venueInfo');
    }

    public function update(Request $request, CricketMatch $match)
    {
        $match->update($request->only('tournament_id', 'group_id', 'match_date', 'venue', 'venue_id', 'overs', 'toss_won_by', 'toss_decision', 'winner_team_id', 'status'));
        return $match;
    }

    public function destroy(CricketMatch $match)
    {
        $match->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function scorecard(CricketMatch $match)
    {
        $innings = PlayerInnings::where('match_id', $match->id)
            ->with('player', 'team')
            ->get()
            ->groupBy(['innings_number', 'team_id']);

        return response()->json([
            'match' => $match->load('teamA', 'teamB', 'winner', 'group', 'venueInfo'),
            'innings' => $innings,
        ]);
    }

    public function updateScore(Request $request, CricketMatch $match)
    {
        $request->validate([
            'player_id' => 'required|exists:players,id',
            'team_id' => 'required|exists:teams,id',
            'innings_number' => 'required|in:1,2',
        ]);

        $innings = PlayerInnings::updateOrCreate(
            [
                'match_id' => $match->id,
                'player_id' => $request->player_id,
                'innings_number' => $request->innings_number,
            ],
            $request->only([
                'team_id', 'runs_scored', 'balls_faced', 'fours', 'sixes', 'how_out', 'bowler_id', 'fielder_id',
                'overs_bowled', 'maidens', 'runs_conceded', 'wickets_taken', 'wides', 'no_balls',
                'catches', 'stumpings', 'run_outs'
            ])
        );

        return response()->json($innings);
    }
}
