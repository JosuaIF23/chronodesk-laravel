<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TimeTrack;
use App\Models\FinanceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class TaskController extends Controller
{
    /**
     * ================================
     * 📋 INDEX - List Semua Task + Statistik
     * ================================
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        // 🔹 Ambil filter dari request
        $q        = $request->string('q')->toString();
        $priority = $request->string('priority')->toString();
        $status   = $request->string('status')->toString(); // completed|active

        // 🔹 Query semua task user
        $tasksQuery = Task::where('user_id', $userId)
            ->with('subTasks')
            ->when($q, fn($query) => $query->where(function ($w) use ($q) {
                $w->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            }))
            ->when($priority, fn($query) => $query->where('priority', $priority))
            ->when($status === 'completed', fn($query) => $query->where('is_completed', true))
            ->when($status === 'active', fn($query) => $query->where('is_completed', false))
            ->latest();

        $tasks = $tasksQuery->paginate(20)->withQueryString();

        // 🔹 Ubah relasi subTasks jadi array agar dikenali React
        $tasks = $tasks->through(function (Task $task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'priority' => $task->priority,
                'due_date' => $task->due_date,
                'is_completed' => $task->is_completed,
                'sub_tasks' => $task->subTasks->map(fn($st) => [
                    'id' => $st->id,
                    'title' => $st->title,
                    'is_completed' => $st->is_completed,
                ]),
            ];
        });

        // ================================
        // 📊 Statistik Waktu Kerja (7 Hari)
        // ================================
        $from = Carbon::now()->subDays(6)->startOfDay();
        $to = Carbon::now()->endOfDay();

        $timeStats = TimeTrack::selectRaw('DATE(started_at) as date, SUM(duration_minutes) as minutes')
            ->where('user_id', $userId)
            ->whereBetween('started_at', [$from, $to])
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $dates = [];
        $timeSeries = [];
        for ($i = 0; $i < 7; $i++) {
            $day = $from->copy()->addDays($i)->toDateString();
            $dates[] = $day;
            $timeSeries[] = (int) ($timeStats[$day]->minutes ?? 0);
        }

        // ================================
        // 💰 Statistik Keuangan Harian (7 Hari)
        // ================================
        $financeLogs = FinanceLog::selectRaw('DATE(transaction_date) as date, type, SUM(amount) as total')
            ->where('user_id', $userId)
            ->whereBetween('transaction_date', [$from, $to])
            ->groupBy('date', 'type')
            ->get();

        // Mapping income & expense harian
        $incomeSeries = [];
        $expenseSeries = [];

        foreach ($dates as $day) {
            $incomeSeries[] = (float) optional(
                $financeLogs->firstWhere(fn($log) => $log->date === $day && $log->type === 'income')
            )->total ?? 0;

            $expenseSeries[] = (float) optional(
                $financeLogs->firstWhere(fn($log) => $log->date === $day && $log->type === 'expense')
            )->total ?? 0;
        }

        return Inertia::render('app/TasksPage', [
            'tasks' => $tasks,
            'filters' => [
                'q' => $q,
                'priority' => $priority,
                'status' => $status,
            ],
            'stats' => [
                'time' => [
                    'categories' => $dates,
                    'series' => $timeSeries,
                ],
                'finance' => [
                    'categories' => $dates,
                    'incomeSeries' => $incomeSeries,
                    'expenseSeries' => $expenseSeries,
                ],
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    // ================================
    // ➕ STORE
    // ================================
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'is_completed' => 'nullable|boolean',
        ]);

        $data['user_id'] = Auth::id();
        $data['is_completed'] = $data['is_completed'] ?? false;

        Task::create($data);

        return back()->with('success', 'Tugas berhasil ditambahkan!');
    }

    // ================================
    // ✏️ UPDATE
    // ================================
    public function update(Request $request, Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
            'is_completed' => 'nullable|boolean',
        ]);

        $task->update($data);
        return back()->with('success', 'Tugas berhasil diperbarui!');
    }

    // ================================
    // ❌ DESTROY
    // ================================
    public function destroy(Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        if ($task->cover && Storage::disk('public')->exists($task->cover)) {
            Storage::disk('public')->delete($task->cover);
        }

        $task->delete();
        return back()->with('success', 'Tugas berhasil dihapus!');
    }

    // ================================
    // 🖼️ UPDATE COVER
    // ================================
    public function updateCover(Request $request, Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        $request->validate([
            'cover' => 'required|image|max:2048',
        ]);

        if ($task->cover && Storage::disk('public')->exists($task->cover)) {
            Storage::disk('public')->delete($task->cover);
        }

        $path = $request->file('cover')->store('covers', 'public');
        $task->update(['cover' => $path]);

        return back()->with('success', 'Cover berhasil diperbarui!');
    }

    // ================================
    // 👁️ SHOW
    // ================================
    public function show(Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        $task->load('subTasks');
        return Inertia::render('app/TaskDetail', [
            'task' => $task->toArray(),
        ]);
    }
}
