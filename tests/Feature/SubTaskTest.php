<?php

namespace Tests\Feature;

use App\Models\SubTask;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_subtask(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post("/todos/{$task->id}/subtasks", [
            'title' => 'My Subtask',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('sub_tasks', [
            'task_id' => $task->id,
            'title'   => 'My Subtask',
        ]);
    }

    public function test_subtask_store_requires_title(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post("/todos/{$task->id}/subtasks", []);
        $response->assertSessionHasErrors('title');
    }

    public function test_unauthenticated_user_cannot_create_subtask(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->post("/todos/{$task->id}/subtasks", ['title' => 'Sub']);
        $response->assertRedirect(route('auth.login'));
    }

    public function test_user_can_toggle_subtask(): void
    {
        $user    = User::factory()->create();
        $task    = Task::factory()->create(['user_id' => $user->id]);
        $subtask = SubTask::factory()->create([
            'task_id'      => $task->id,
            'is_completed' => false,
        ]);

        $response = $this->actingAs($user)->patch("/subtasks/{$subtask->id}/toggle");

        $response->assertRedirect();
        $this->assertDatabaseHas('sub_tasks', [
            'id'           => $subtask->id,
            'is_completed' => true,
        ]);
    }

    public function test_toggle_flips_state_back(): void
    {
        $user    = User::factory()->create();
        $task    = Task::factory()->create(['user_id' => $user->id]);
        $subtask = SubTask::factory()->create([
            'task_id'      => $task->id,
            'is_completed' => true,
        ]);

        $this->actingAs($user)->patch("/subtasks/{$subtask->id}/toggle");

        $this->assertDatabaseHas('sub_tasks', [
            'id'           => $subtask->id,
            'is_completed' => false,
        ]);
    }

    public function test_user_can_delete_subtask(): void
    {
        $user    = User::factory()->create();
        $task    = Task::factory()->create(['user_id' => $user->id]);
        $subtask = SubTask::factory()->create(['task_id' => $task->id]);

        $response = $this->actingAs($user)->delete("/subtasks/{$subtask->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('sub_tasks', ['id' => $subtask->id]);
    }

    public function test_unauthenticated_user_cannot_delete_subtask(): void
    {
        $user    = User::factory()->create();
        $task    = Task::factory()->create(['user_id' => $user->id]);
        $subtask = SubTask::factory()->create(['task_id' => $task->id]);

        $response = $this->delete("/subtasks/{$subtask->id}");
        $response->assertRedirect(route('auth.login'));
    }
}
