<?php

namespace Tests\Unit\Models;

use App\Models\FinanceLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanceLogModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_financelog_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $log  = FinanceLog::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $log->user);
        $this->assertEquals($user->id, $log->user->id);
    }

    public function test_transaction_date_cast_to_date(): void
    {
        $log = FinanceLog::factory()->create(['transaction_date' => '2026-03-01']);
        $this->assertInstanceOf(\Carbon\Carbon::class, $log->transaction_date);
    }

    public function test_financelog_fillable_fields(): void
    {
        $fillable = (new FinanceLog())->getFillable();

        foreach (['user_id', 'title', 'amount', 'type', 'transaction_date'] as $field) {
            $this->assertContains($field, $fillable);
        }
    }
}
