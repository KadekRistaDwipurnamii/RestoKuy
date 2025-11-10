<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')
                  ->constrained('members')
                  ->onDelete('cascade');

            $table->unsignedBigInteger('produk_id');
            $table->foreign('produk_id')
                  ->references('product_id')
                  ->on('products')
                  ->onDelete('cascade');

            $table->date('tanggal');
            $table->decimal('total', 10, 2);
            $table->enum('status_pembayaran', ['pending', 'valid', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
