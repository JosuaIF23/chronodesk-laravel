<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('is_completed');
        });

        Schema::table('time_tracks', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('started_at');
        });

        Schema::table('finance_logs', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('transaction_date');
        });

        Schema::table('sub_tasks', function (Blueprint $table) {
            $table->index('task_id');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['is_completed']);
        });

        Schema::table('time_tracks', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['started_at']);
        });

        Schema::table('finance_logs', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['transaction_date']);
        });

        Schema::table('sub_tasks', function (Blueprint $table) {
            $table->dropIndex(['task_id']);
        });
    }
};
