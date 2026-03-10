<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubTaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'task_id'      => Task::factory(),
            'title'        => $this->faker->sentence(3),
            'is_completed' => false,
        ];
    }
}
