<?php

use Illuminate\Support\Facades\Route;
use App\Models\Task; // ✅ gunakan model Task
use Carbon\Carbon;

Route::get('/reminders', function () {
  $tasks = Task::where('is_completed', false)
    ->whereBetween('due_date', [now(), now()->addHour()]) // < 1 jam lagi
    ->get()
    ->map(fn($t) => [
      'title' => $t->title,
      'due_date' => Carbon::parse($t->due_date)->format('d M Y H:i'),
      'remaining_time' => Carbon::parse($t->due_date)->diffForHumans(),
    ]);

  return response()->json($tasks);
});
