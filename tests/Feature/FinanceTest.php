<?php

namespace Tests\Feature;

use App\Models\FinanceLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_redirected_from_finance(): void
    {
        $response = $this->get('/finance');
        $response->assertRedirect(route('auth.login'));
    }

    public function test_authenticated_user_can_view_finance(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/finance');
        $response->assertStatus(200);
    }

    public function test_user_can_create_finance_log(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/finance', [
            'title'            => 'Salary',
            'amount'           => 5000000,
            'type'             => 'income',
            'transaction_date' => '2026-03-01',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('finance_logs', [
            'user_id' => $user->id,
            'title'   => 'Salary',
            'type'    => 'income',
        ]);
    }

    public function test_create_finance_log_validation(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/finance', []);
        $response->assertSessionHasErrors(['title', 'amount', 'type', 'transaction_date']);
    }

    public function test_create_finance_log_requires_valid_type(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/finance', [
            'title'            => 'Misc',
            'amount'           => 100,
            'type'             => 'invalid',
            'transaction_date' => '2026-03-01',
        ]);

        $response->assertSessionHasErrors('type');
    }

    public function test_create_finance_log_requires_non_negative_amount(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/finance', [
            'title'            => 'Neg',
            'amount'           => -100,
            'type'             => 'expense',
            'transaction_date' => '2026-03-01',
        ]);

        $response->assertSessionHasErrors('amount');
    }

    public function test_user_can_update_own_finance_log(): void
    {
        $user = User::factory()->create();
        $log  = FinanceLog::factory()->create(['user_id' => $user->id, 'title' => 'Old']);

        $response = $this->actingAs($user)->patch("/finance/{$log->id}", [
            'title'            => 'Updated',
            'amount'           => 200000,
            'type'             => 'expense',
            'transaction_date' => '2026-03-05',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('finance_logs', ['id' => $log->id, 'title' => 'Updated']);
    }

    public function test_user_cannot_update_another_users_finance_log(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $log   = FinanceLog::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($other)->patch("/finance/{$log->id}", [
            'title'            => 'Hacked',
            'amount'           => 1,
            'type'             => 'income',
            'transaction_date' => '2026-03-01',
        ]);

        $response->assertStatus(404);
    }

    public function test_user_can_delete_own_finance_log(): void
    {
        $user = User::factory()->create();
        $log  = FinanceLog::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/finance/{$log->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('finance_logs', ['id' => $log->id]);
    }

    public function test_user_cannot_delete_another_users_finance_log(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $log   = FinanceLog::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($other)->delete("/finance/{$log->id}");
        $response->assertStatus(404);
    }

    public function test_unauthenticated_user_cannot_store_finance(): void
    {
        $response = $this->post('/finance', [
            'title'            => 'Test',
            'amount'           => 100,
            'type'             => 'income',
            'transaction_date' => '2026-03-01',
        ]);
        $response->assertRedirect(route('auth.login'));
    }
}
