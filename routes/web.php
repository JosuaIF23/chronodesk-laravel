<?php

use Illuminate\Support\Facades\Route;

// Controller imports
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimeTrackController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\CalendarController;

// 🔹 Semua route Inertia
Route::middleware(['handle.inertia'])->group(function () {

    /**
     * =========================
     * 🧭 AUTH ROUTES
     * =========================
     */
    Route::prefix('auth')->group(function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');

        Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');

        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });

    /**
     * =========================
     * 🔐 PROTECTED ROUTES
     * =========================
     */
    Route::middleware(['check.auth'])->group(function () {

        // 🔹 Dashboard / Beranda
        Route::get('/', [HomeController::class, 'home'])->name('home');

        /**
         * =========================
         * ✅ TASK (TODO) MANAGEMENT
         * =========================
         */
        Route::prefix('todos')->group(function () {
            Route::get('/', [TaskController::class, 'index'])->name('todos.index');
            Route::post('/', [TaskController::class, 'store'])->name('todos.store');
            Route::patch('/{task}', [TaskController::class, 'update'])->name('todos.update');
            Route::delete('/{task}', [TaskController::class, 'destroy'])->name('todos.destroy');
            Route::get('/{task}', [TaskController::class, 'show'])->name('todos.show');
            Route::post('/{task}/cover', [TaskController::class, 'updateCover'])->name('todos.cover');
        });

        /**
         * =========================
         * 🕓 TIMER TRACKING
         * =========================
         */
        Route::prefix('timer')->group(function () {
            Route::get('/', [TimeTrackController::class, 'index'])->name('timer.index');
            Route::post('/start', [TimeTrackController::class, 'start'])->name('timer.start');
            Route::post('/stop', [TimeTrackController::class, 'stop'])->name('timer.stop');
        });

        /**
         * =========================
         * 💰 FINANCE MANAGEMENT
         * =========================
         */
        Route::prefix('finance')->group(function () {
            Route::get('/', [FinanceController::class, 'index'])->name('finance.index');
            Route::post('/', [FinanceController::class, 'store'])->name('finance.store');
            Route::patch('/{id}', [FinanceController::class, 'update'])->name('finance.update');
            Route::delete('/{id}', [FinanceController::class, 'destroy'])->name('finance.destroy');
        });

        /**
         * =========================
         * 📅 CALENDAR
         * =========================
         */
        Route::prefix('calendar')->group(function () {
            Route::get('/', [CalendarController::class, 'index'])->name('calendar.index');
            Route::get('/feed', [CalendarController::class, 'feed'])->name('calendar.feed');
        });
    });
});
