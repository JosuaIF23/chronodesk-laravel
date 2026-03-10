<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TimeTrackFactory extends Factory
{
    public function definition(): array
    {
        $started = $this->faker->dateTimeBetween('-7 days', 'now');
        $ended   = $this->faker->dateTimeBetween($started, 'now');

        return [
            'user_id'          => User::factory(),
            'started_at'       => $started,
            'ended_at'         => $ended,
            'duration_minutes' => $this->faker->numberBetween(1, 120),
        ];
    }
}
