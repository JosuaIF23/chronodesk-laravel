<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),
            'title'        => $this->faker->sentence(4),
            'description'  => $this->faker->paragraph(),
            'priority'     => $this->faker->randomElement(['low', 'medium', 'high']),
            'due_date'     => $this->faker->optional()->dateTimeBetween('now', '+3 months'),
            'is_completed' => false,
            'cover'        => null,
        ];
    }
}
