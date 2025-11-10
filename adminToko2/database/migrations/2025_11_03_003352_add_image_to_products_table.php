<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi: tambahkan kolom 'image' ke tabel products.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Tambahkan kolom 'image' bertipe string, boleh kosong (nullable)
            $table->string('image')->nullable()->after('price');
        });
    }

    /**
     * Kembalikan migrasi: hapus kolom 'image' jika rollback dijalankan.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};
