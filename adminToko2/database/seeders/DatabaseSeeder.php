<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus user test kalau sudah ada
        DB::table('users')->where('email', 'test@example.com')->delete();

        // Isi ulang user test
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Jalankan seeder kategori
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
