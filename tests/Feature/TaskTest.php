<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_redirected_from_todos(): void
    {
        $response = $this->get('/todos');
        $response->assertRedirect(route('auth.login'));
    }

    public function test_authenticated_user_can_view_todos(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/todos');
        $response->assertStatus(200);
    }

    public function test_todos_index_with_search_filter(): void
    {
        $user = User::factory()->create();
        Task::factory()->create(['user_id' => $user->id, 'title' => 'Find Me Task']);
        Task::factory()->create(['user_id' => $user->id, 'title' => 'Other Task']);

        $response = $this->actingAs($user)->get('/todos?q=Find+Me');
        $response->assertStatus(200);
    }

    public function test_todos_index_with_priority_filter(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/todos?priority=high');
        $response->assertStatus(200);
    }

    public function test_todos_index_with_status_filter(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/todos?status=completed');
        $response->assertStatus(200);
    }

    public function test_user_can_create_task(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/todos', [
            'title'        => 'New Task',
            'description'  => 'Task description',
            'priority'     => 'high',
            'due_date'     => '2026-12-31',
            'is_completed' => false,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'user_id' => $user->id,
            'title'   => 'New Task',
            'priority' => 'high',
        ]);
    }

    public function test_create_task_requires_title(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/todos', [
            'priority' => 'low',
        ]);
        $response->assertSessionHasErrors('title');
    }

    public function test_create_task_requires_valid_priority(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post('/todos', [
            'title'    => 'Task',
            'priority' => 'invalid',
        ]);
        $response->assertSessionHasErrors('priority');
    }

    public function test_user_can_update_own_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id, 'title' => 'Old Title']);

        $response = $this->actingAs($user)->patch("/todos/{$task->id}", [
            'title'    => 'New Title',
            'priority' => 'medium',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => 'New Title']);
    }

    public function test_user_cannot_update_another_users_task(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $task  = Task::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($other)->patch("/todos/{$task->id}", [
            'title'    => 'Hacked',
            'priority' => 'low',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete("/todos/{$task->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_user_cannot_delete_another_users_task(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $task  = Task::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($other)->delete("/todos/{$task->id}");
        $response->assertStatus(403);
    }

    public function test_user_can_view_own_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get("/todos/{$task->id}");
        $response->assertStatus(200);
    }

    public function test_user_cannot_view_another_users_task(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $task  = Task::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($other)->get("/todos/{$task->id}");
        $response->assertStatus(403);
    }

    public function test_user_can_upload_task_cover(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->image('cover.jpg');

        $response = $this->actingAs($user)->patch("/todos/{$task->id}/cover", [
            'cover' => $file,
        ]);

        $response->assertRedirect();
        $task->refresh();
        $this->assertNotNull($task->cover);
        Storage::disk('public')->assertExists($task->cover);
    }

    public function test_cover_upload_requires_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->patch("/todos/{$task->id}/cover", [
            'cover' => $file,
        ]);

        $response->assertSessionHasErrors('cover');
    }

    public function test_old_cover_is_deleted_on_update(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'cover'   => 'covers/old.jpg',
        ]);
        Storage::disk('public')->put('covers/old.jpg', 'fake content');

        $file = UploadedFile::fake()->image('new.jpg');
        $this->actingAs($user)->patch("/todos/{$task->id}/cover", ['cover' => $file]);

        Storage::disk('public')->assertMissing('covers/old.jpg');
    }

    public function test_cannot_upload_cover_for_another_users_task(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $task  = Task::factory()->create(['user_id' => $owner->id]);

        $file = UploadedFile::fake()->image('cover.jpg');
        $response = $this->actingAs($other)->patch("/todos/{$task->id}/cover", [
            'cover' => $file,
        ]);

        $response->assertStatus(403);
    }
}
