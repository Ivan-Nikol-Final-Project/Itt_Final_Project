<?php

use Illuminate\Database\Seeder;

class StatisticsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();
        for ($i = 5; $i < 20; $i += 1) {
            \App\Statistic::create([
                'user_id' => $i + 1,
                'high_score' => $faker->numberBetween($min = 1, $max = 10000),
                'last_score' => $faker->numberBetween($min = 1, $max = 1000),

            ]);
        }
    }
}
