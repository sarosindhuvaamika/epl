<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'password' => 'admin123',
            'phone_no' => '9876543210',
            'role' => 'admin',
        ]);
    }
}
