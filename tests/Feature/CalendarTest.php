<?php

namespace Tests\Feature;

use App\Models\FinanceLog;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalendarTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_redirected_from_calendar(): void
    {
        $response = $this->get('/calendar');
        $response->assertRedirect(route('auth.login'));
    }

    public function test_authenticated_user_can_view_calendar(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/calendar');
        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_redirected_from_feed(): void
    {
        $response = $this->get('/calendar/feed');
        $response->assertRedirect(route('auth.login'));
    }

    public function test_calendar_feed_returns_json(): void
    {
        $user = User::factory()->create();

        Task::factory()->create([
            'user_id'  => $user->id,
            'title'    => 'Task Event',
            'due_date' => '2026-04-01',
        ]);

        FinanceLog::factory()->create([
            'user_id'          => $user->id,
            'title'            => 'Finance Event',
            'transaction_date' => '2026-04-05',
        ]);

        $response = $this->actingAs($user)->get('/calendar/feed');

        $response->assertStatus(200);
        $response->assertJsonCount(2);
    }

    public function test_feed_only_returns_own_data(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Task::factory()->create(['user_id' => $user1->id, 'due_date' => '2026-04-01']);
        Task::factory()->create(['user_id' => $user2->id, 'due_date' => '2026-04-02']);

        $response = $this->actingAs($user1)->get('/calendar/feed');
        $data = $response->json();

        $this->assertCount(1, $data);
    }

    public function test_feed_excludes_tasks_without_due_date(): void
    {
        $user = User::factory()->create();
        Task::factory()->create(['user_id' => $user->id, 'due_date' => null]);

        $response = $this->actingAs($user)->get('/calendar/feed');
        $response->assertJsonCount(0);
    }
}
