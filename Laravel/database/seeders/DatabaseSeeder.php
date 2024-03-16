<?php

namespace Database\Seeders;

use App\Models\Tarea;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::create([
                                     'name' => "demo",
                                     'email' => 'demo@demo.com',
                                     'password' => Hash::make('demo'),
                                 ]);

        for ($i = 0; $i < 20; $i++) {
            $tarea = new Tarea();
            $tarea->title = md5(random_bytes(20));
            $tarea->description = md5(random_bytes(20));
            $tarea->completed = (bool) random_int(0, 1);

            $tarea->save();
        }
    }
}
