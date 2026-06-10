<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageVisit;
use App\Models\SiteStat;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    public function track(Request $request)
    {
        $request->validate([
            'page_path' => 'required|string',
            'session_id' => 'required|string',
        ]);

        // Check if this is a new session BEFORE inserting
        $isNewSession = !PageVisit::where('session_id', $request->session_id)->exists();

        // Record page visit
        PageVisit::create([
            'page_path' => $request->page_path,
            'session_id' => $request->session_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Increment total visits only for new sessions
        if ($isNewSession) {
            $stat = SiteStat::firstOrCreate(['key' => 'total_visits'], ['value' => 0]);
            $stat->increment('value');
        }

        // Increment page view count
        $pageStat = SiteStat::firstOrCreate(['key' => 'page_views_' . $request->page_path], ['value' => 0]);
        $pageStat->increment('value');

        return response()->json(['status' => 'ok']);
    }

    public function heartbeat(Request $request)
    {
        $request->validate(['session_id' => 'required|string']);

        SiteStat::updateOrCreate(
            ['key' => 'live_' . $request->session_id],
            ['value' => time()]
        );

        return response()->json(['status' => 'ok']);
    }

    public function stats()
    {
        $totalVisits = SiteStat::where('key', 'total_visits')->value('value') ?? 0;

        $threshold = time() - 30;
        $liveVisitors = SiteStat::where('key', 'like', 'live_%')
            ->where('value', '>=', $threshold)
            ->count();

        // Clean stale sessions
        SiteStat::where('key', 'like', 'live_%')
            ->where('value', '<', $threshold)
            ->delete();

        $pageViews = SiteStat::where('key', 'like', 'page_views_%')
            ->get()
            ->mapWithKeys(function ($item) {
                $path = str_replace('page_views_', '', $item->key);
                return [$path => (int) $item->value];
            });

        return response()->json([
            'total_visits' => (int) $totalVisits,
            'live_visitors' => $liveVisitors,
            'page_views' => $pageViews,
        ]);
    }
}
