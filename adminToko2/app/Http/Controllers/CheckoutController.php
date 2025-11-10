<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|integer',
            'products' => 'required|array',
            'total' => 'required|numeric',
            'payment_method' => 'required|string',
        ]);

        // Simpan transaksi utama
        $transaksi = Transaksi::create([
            'member_id' => $request->member_id,
            'product_id' => $request->products[0]['id'], // ambil id produk pertama
            'tanggal' => now()->toDateString(),
            'total' => $request->total,
            'status_pembayaran' => $request->payment_method === 'QRIS' ? 'valid' : 'pending',
        ]);

        return response()->json([
            'message' => 'Checkout berhasil, data tersimpan!',
            'data' => $transaksi
        ], 201);
    }
}
