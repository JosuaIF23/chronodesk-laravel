<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_redirected_from_home(): void
    {
        $response = $this->get('/');
        $response->assertRedirect(route('auth.login'));
    }

    public function test_authenticated_user_can_access_home(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/');
        $response->assertStatus(200);
    }
}
