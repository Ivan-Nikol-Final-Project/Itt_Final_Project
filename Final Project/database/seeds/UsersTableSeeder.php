<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $faker = Faker\Factory::create();
        for ($i = 0; $i < 20; $i +=1) {
            \App\User::create ([
                'email' => $faker->email,
                'password' => bcrypt('secret'),
                'username' => $faker->userName,
                'gold' => 1000,
                'api_token' => md5(microtime(true)),
            ]);

        }
    }
}
