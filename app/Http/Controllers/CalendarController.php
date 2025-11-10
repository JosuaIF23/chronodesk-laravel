<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Task;
use App\Models\FinanceLog;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    // ✅ Menampilkan halaman kalender (FullCalendar)
    public function index()
    {
        return Inertia::render('app/CalendarPage');
    }

    // ✅ Mengirim data JSON event untuk FullCalendar
    public function feed()
    {
        $userId = Auth::id();

        $tasks = Task::where('user_id', $userId)
            ->selectRaw("id, title, due_date as start, 'Task' as type")
            ->whereNotNull('due_date')
            ->get();

        $finances = FinanceLog::where('user_id', $userId)
            ->selectRaw("id, title, transaction_date as start, type")
            ->get();

        return response()->json($tasks->merge($finances));
    }
}
