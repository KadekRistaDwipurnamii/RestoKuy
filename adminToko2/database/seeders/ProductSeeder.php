<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Nasi Goreng Spesial',
                'slug' => Str::slug('Nasi Goreng Spesial'),
                'description' => 'Nasi goreng dengan ayam dan telur mata sapi',
                'category_id' => rand(1),
                'price' => 25000,
                'image' => 'products/nasi_goreng_spesial.jpg',
                'stock' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ayam Geprek',
                'slug' => Str::slug('Ayam Geprek'),
                'description' => 'Ayam crispy dengan sambal bawang pedas',
                'category_id' => rand(1),
                'price' => 22000,
                'image' => 'products/ayam_geprek.jpg',
                'stock' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Es Teh Manis',
                'slug' => Str::slug('Es Teh Manis'),
                'description' => 'Minuman teh dingin yang menyegarkan',
                'category_id' => rand(2),
                'price' => 8000,
                'image' => 'products/es_teh_manis.jpg',
                'stock' => 40,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mie Goreng Jawa',
                'slug' => Str::slug('Mie Goreng Jawa'),
                'description' => 'Mie goreng khas Jawa dengan topping ayam dan telur',
                'category_id' => rand(1),
                'price' => 23000,
                'image' => 'products/mie_goreng_jawa.jpg',
                'stock' => 18,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sate Ayam',
                'slug' => Str::slug('Sate Ayam'),
                'description' => 'Sate ayam dengan bumbu kacang gurih dan lontong',
                'category_id' => rand(1),
                'price' => 27000,
                'image' => 'products/sate_ayam.jpg',
                'stock' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
