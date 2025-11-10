<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Member;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class TransaksiController extends Controller
{
    // 🔹 Tampilkan semua transaksi + pencarian + pagination + filter
    public function index(Request $request)
    {
        $query = Transaksi::query()->with(['product', 'member']);

        // filter berdasarkan nama member / produk
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('member', function ($q2) use ($search) {
                    $q2->where('nama', 'like', "%{$search}%");
                })->orWhereHas('product', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                });
            });
        }

        // filter tanggal (YYYY-MM-DD)
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        // filter bulan (1-12)
        if ($request->filled('bulan')) {
            $query->whereMonth('tanggal', $request->bulan);
        }

        $transaksis = $query->orderBy('tanggal', 'desc')->paginate(10);

        return view('admin.transaksi.index', compact('transaksis'));
    }

    // 🔹 Detail transaksi per member
    public function show(Transaksi $transaksi)
    {
        $transaksi->load(['member', 'product']);
        return view('admin.transaksi.show', compact('transaksi'));
    }


    // 🔹 Validasi pembayaran
    public function validatePayment($id)
    {
        $transaksi = Transaksi::findOrFail($id);
        $transaksi->status_pembayaran = 'valid';
        $transaksi->save();

        return redirect()->back()->with('success', 'Pembayaran berhasil divalidasi!');
    }

    public function backupDaily()
    {
        $tanggal = now()->toDateString();
        $transaksi = Transaksi::with(['product', 'member'])
            ->whereDate('tanggal', $tanggal)
            ->get();

        if ($transaksi->isEmpty()) {
            return response()->json(['message' => 'Tidak ada data transaksi hari ini.'], 404);
        }

        $filename = "backup_transaksi_harian_{$tanggal}.csv";
        $filepath = storage_path("app/public/{$filename}");

        // Buat file CSV
        $file = fopen($filepath, 'w');
        fputcsv($file, ['Tanggal', 'Nama Member', 'Nama Produk', 'Total Harga']);

        foreach ($transaksi as $t) {
            fputcsv($file, [
                $t->tanggal,
                $t->member->nama ?? '-',
                $t->product->name ?? '-',
                $t->total_harga,
            ]);
        }
        fclose($file);

        // Return file untuk di-download
        return response()->download($filepath, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function backupMonthly()
    {
        $bulan = now()->month;
        $tahun = now()->year;
        $transaksi = Transaksi::with(['product', 'member'])
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get();

        if ($transaksi->isEmpty()) {
            return response()->json(['message' => 'Tidak ada data transaksi bulan ini.'], 404);
        }

        $filename = "backup_transaksi_bulanan_{$tahun}_{$bulan}.csv";
        $filepath = storage_path("app/public/{$filename}");

        $file = fopen($filepath, 'w');
        fputcsv($file, ['Tanggal', 'Nama Member', 'Nama Produk', 'Total Harga']);

        foreach ($transaksi as $t) {
            fputcsv($file, [
                $t->tanggal,
                $t->member->nama ?? '-',
                $t->product->name ?? '-',
                $t->total_harga,
            ]);
        }
        fclose($file);

        return response()->download($filepath, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}