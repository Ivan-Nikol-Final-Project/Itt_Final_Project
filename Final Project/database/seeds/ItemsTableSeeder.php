<?php

use Illuminate\Database\Seeder;

class ItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \Illuminate\Support\Facades\DB::table('items')->insert([
            'value' => '1000'
        ]);

        \Illuminate\Support\Facades\DB::table('items')->insert([
            'value' => '3000'
        ]);

        \Illuminate\Support\Facades\DB::table('items')->insert([
            'value' => '10000'
        ]);
    }

}
