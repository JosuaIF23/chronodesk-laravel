<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FinanceLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'title'            => $this->faker->sentence(3),
            'amount'           => $this->faker->randomFloat(2, 10000, 5000000),
            'type'             => $this->faker->randomElement(['income', 'expense']),
            'transaction_date' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
