<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // ← Tambahkan ini

return new class extends Migration {
    public function up(): void
    {
        Schema::create('finance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['income', 'expense']);
            $table->decimal('amount', 15, 2)->default(0);
            $table->date('transaction_date')->default(DB::raw('CURRENT_DATE')); // ✅ ini penting
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finance_logs');
    }
};
