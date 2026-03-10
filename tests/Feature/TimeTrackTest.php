<?php

namespace Tests\Feature;

use App\Models\TimeTrack;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimeTrackTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_redirected_from_timer(): void
    {
        $response = $this->get('/timer');
        $response->assertRedirect(route('auth.login'));
    }

    public function test_authenticated_user_can_view_timer(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/timer');
        $response->assertStatus(200);
    }

    public function test_user_can_start_timer(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/timer/start');

        $response->assertRedirect();
        $this->assertDatabaseHas('time_tracks', [
            'user_id'  => $user->id,
            'ended_at' => null,
        ]);
    }

    public function test_starting_timer_stops_existing_session(): void
    {
        $user  = User::factory()->create();
        $track = TimeTrack::factory()->create([
            'user_id'  => $user->id,
            'ended_at' => null,
        ]);

        $this->actingAs($user)->post('/timer/start');

        $track->refresh();
        $this->assertNotNull($track->ended_at);
    }

    public function test_user_can_stop_timer(): void
    {
        $user  = User::factory()->create();
        $track = TimeTrack::factory()->create([
            'user_id'          => $user->id,
            'ended_at'         => null,
            'duration_minutes' => 0,
        ]);

        $response = $this->actingAs($user)->post('/timer/stop');

        $response->assertRedirect();
        $track->refresh();
        $this->assertNotNull($track->ended_at);
    }

    public function test_stop_with_no_active_session_returns_error(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/timer/stop');

        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    public function test_unauthenticated_user_cannot_start_timer(): void
    {
        $response = $this->post('/timer/start');
        $response->assertRedirect(route('auth.login'));
    }

    public function test_unauthenticated_user_cannot_stop_timer(): void
    {
        $response = $this->post('/timer/stop');
        $response->assertRedirect(route('auth.login'));
    }
}
