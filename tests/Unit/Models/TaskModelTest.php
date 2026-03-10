<?php

namespace Tests\Unit\Models;

use App\Models\SubTask;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_task_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($user->id, $task->user->id);
    }

    public function test_task_has_many_subtasks(): void
    {
        $task = Task::factory()->create();
        SubTask::factory()->count(3)->create(['task_id' => $task->id]);

        $this->assertCount(3, $task->subTasks);
        $this->assertInstanceOf(SubTask::class, $task->subTasks->first());
    }

    public function test_is_completed_cast_to_boolean(): void
    {
        $task = Task::factory()->create(['is_completed' => false]);
        $this->assertIsBool($task->is_completed);
    }

    public function test_due_date_cast_to_datetime(): void
    {
        $task = Task::factory()->create(['due_date' => '2026-12-31']);
        $this->assertInstanceOf(\Carbon\Carbon::class, $task->due_date);
    }

    public function test_task_fillable_fields(): void
    {
        $fillable = (new Task())->getFillable();

        foreach (['user_id', 'title', 'description', 'priority', 'due_date', 'is_completed', 'cover'] as $field) {
            $this->assertContains($field, $fillable);
        }
    }
}
