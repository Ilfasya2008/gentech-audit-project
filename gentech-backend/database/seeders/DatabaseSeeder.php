<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Admin User
        User::firstOrCreate(
            ['email' => 'admin@gentech.com'],
            [
                'name' => 'Admin GenTech',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Default Normal User
        User::firstOrCreate(
            ['email' => 'user@gentech.com'],
            [
                'name' => 'John Doe',
                'password' => \Illuminate\Support\Facades\Hash::make('user123'),
                'role' => 'user',
            ]
        );

        // Call SimulationTransactionSeeder
        $this->call(SimulationTransactionSeeder::class);
    }
}
