<?php

namespace Tests\Unit\Models;

use App\Models\TimeTrack;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimeTrackModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_timetrack_belongs_to_user(): void
    {
        $user  = User::factory()->create();
        $track = TimeTrack::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $track->user);
        $this->assertEquals($user->id, $track->user->id);
    }

    public function test_started_at_cast_to_datetime(): void
    {
        $track = TimeTrack::factory()->create();
        $this->assertInstanceOf(\Carbon\Carbon::class, $track->started_at);
    }

    public function test_ended_at_cast_to_datetime(): void
    {
        $track = TimeTrack::factory()->create();
        $this->assertInstanceOf(\Carbon\Carbon::class, $track->ended_at);
    }

    public function test_timetrack_fillable_fields(): void
    {
        $fillable = (new TimeTrack())->getFillable();

        foreach (['user_id', 'started_at', 'ended_at', 'duration_minutes'] as $field) {
            $this->assertContains($field, $fillable);
        }
    }
}
