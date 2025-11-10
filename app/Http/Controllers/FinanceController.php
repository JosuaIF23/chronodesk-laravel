<?php

namespace App\Http\Controllers;

use App\Models\FinanceLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $logs = FinanceLog::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        $income = FinanceLog::where('user_id', Auth::id())->where('type', 'income')->sum('amount');
        $expense = FinanceLog::where('user_id', Auth::id())->where('type', 'expense')->sum('amount');

        return Inertia::render('app/FinancePage', [
            'logs' => $logs,
            'summary' => [
                'income' => $income,
                'expense' => $expense,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense',
            'transaction_date' => 'required|date',
        ]);

        $data['user_id'] = Auth::id();

        FinanceLog::create($data);
        return back()->with('success', 'Data keuangan berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $log = FinanceLog::where('user_id', Auth::id())->findOrFail($id);
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense',
            'transaction_date' => 'required|date',
        ]);
        $log->update($data);
        return back()->with('success', 'Data diperbarui.');
    }

    public function destroy($id)
    {
        $log = FinanceLog::where('user_id', Auth::id())->findOrFail($id);
        $log->delete();
        return back()->with('success', 'Data dihapus.');
    }
}
