<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_renders_for_guest(): void
    {
        $response = $this->get('/auth/login');
        $response->assertStatus(200);
    }

    public function test_register_page_renders_for_guest(): void
    {
        $response = $this->get('/auth/register');
        $response->assertStatus(200);
    }

    public function test_authenticated_user_redirected_from_login(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/auth/login');
        $response->assertRedirect(route('home'));
    }

    public function test_authenticated_user_redirected_from_register(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/auth/register');
        $response->assertRedirect(route('home'));
    }

    public function test_user_can_register(): void
    {
        $response = $this->post('/auth/register/post', [
            'name'     => 'Test User',
            'email'    => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('auth.login'));
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_register_requires_unique_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->post('/auth/register/post', [
            'name'     => 'Another User',
            'email'    => 'taken@example.com',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_register_requires_name(): void
    {
        $response = $this->post('/auth/register/post', [
            'email'    => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_register_requires_min_6_password(): void
    {
        $response = $this->post('/auth/register/post', [
            'name'     => 'Test User',
            'email'    => 'test@example.com',
            'password' => 'abc',
        ]);

        $response->assertSessionHasErrors('password');
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/auth/login/post', [
            'email'    => $user->email,
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('home'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('correct'),
        ]);

        $response = $this->post('/auth/login/post', [
            'email'    => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_login_fails_with_missing_fields(): void
    {
        $response = $this->post('/auth/login/post', []);
        $response->assertSessionHasErrors(['email', 'password']);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/auth/logout');

        $response->assertRedirect(route('auth.login'));
        $this->assertGuest();
    }
}
