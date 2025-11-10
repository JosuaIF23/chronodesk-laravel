<?php

namespace App\Http\Controllers;

use App\Models\TimeTrack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class TimeTrackController extends Controller
{
    public function index()
    {
        $tracks = TimeTrack::where('user_id', Auth::id())
            ->orderByDesc('started_at')
            ->take(10)
            ->get();

        $current = $tracks->firstWhere('ended_at', null);

        return Inertia::render('app/TimerPage', [
            'tracks' => $tracks,
            'current' => $current,
        ]);
    }

    public function start()
    {
        // stop dulu sesi lama jika masih aktif
        TimeTrack::where('user_id', Auth::id())
            ->whereNull('ended_at')
            ->update(['ended_at' => now()]);

        $track = TimeTrack::create([
            'user_id' => Auth::id(),
            'started_at' => now(),
            'duration_minutes' => 0,
        ]);

        return back()->with('success', 'Timer dimulai!');
    }

    public function stop()
    {
        $track = TimeTrack::where('user_id', Auth::id())
            ->whereNull('ended_at')
            ->latest()
            ->first();

        if ($track) {
            $track->ended_at = now();
            $track->duration_minutes = round(Carbon::parse($track->started_at)->floatDiffInSeconds(now()) / 60, 2);
            $track->save();

            return back()->with('success', 'Timer dihentikan!');
        }

        return back()->with('error', 'Tidak ada sesi yang sedang berjalan.');
    }
}
