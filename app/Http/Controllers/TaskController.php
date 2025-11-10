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
     * List semua task user dengan filter, pencarian, dan pagination.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        $q        = $request->string('q')->toString();
        $priority = $request->string('priority')->toString();
        $status   = $request->string('status')->toString(); // completed|active

        $tasks = Task::where('user_id', $userId)
            ->when($q, fn($query) => $query->where(function ($w) use ($q) {
                $w->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            }))
            ->when($priority, fn($query) => $query->where('priority', $priority))
            ->when($status === 'completed', fn($query) => $query->where('is_completed', true))
            ->when($status === 'active', fn($query) => $query->where('is_completed', false))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // Statistik waktu kerja (7 hari terakhir)
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

        // Statistik keuangan
        $income = FinanceLog::where('user_id', $userId)
            ->whereBetween('transaction_date', [$from, $to])
            ->where('type', 'income')
            ->sum('amount');

        $expense = FinanceLog::where('user_id', $userId)
            ->whereBetween('transaction_date', [$from, $to])
            ->where('type', 'expense')
            ->sum('amount');

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
                    'income' => (float) $income,
                    'expense' => (float) $expense,
                ],
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Simpan task baru.
     */
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

    /**
     * Update task.
     */
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

    /**
     * Hapus task.
     */
    public function destroy(Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        if ($task->cover && Storage::disk('public')->exists($task->cover)) {
            Storage::disk('public')->delete($task->cover);
        }

        $task->delete();
        return back()->with('success', 'Tugas berhasil dihapus!');
    }

    /**
     * Ubah cover image task.
     */
    public function updateCover(Request $request, Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        $request->validate([
            'cover' => 'required|image|max:2048', // 2MB max
        ]);

        if ($task->cover && Storage::disk('public')->exists($task->cover)) {
            Storage::disk('public')->delete($task->cover);
        }

        $path = $request->file('cover')->store('covers', 'public');
        $task->update(['cover' => $path]);

        return back()->with('success', 'Cover berhasil diperbarui!');
    }

    /**
     * Tampilkan detail task (untuk halaman TaskDetail.jsx)
     */
    public function show(Task $task)
    {
        abort_unless($task->user_id === Auth::id(), 403);

        return Inertia::render('app/TaskDetail', [
            'task' => $task,
        ]);
    }
}
