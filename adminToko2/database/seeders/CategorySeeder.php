<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category; // tambahkan ini

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Gunakan firstOrCreate biar tidak dobel
        Category::firstOrCreate(['category' => 'Elektronik']);
        Category::firstOrCreate(['category' => 'Fashion']);
        Category::firstOrCreate(['category' => 'Makanan & Minuman']);
        Category::firstOrCreate(['category' => 'Olahraga']);
        Category::firstOrCreate(['category' => 'Kecantikan']);
    }
}
