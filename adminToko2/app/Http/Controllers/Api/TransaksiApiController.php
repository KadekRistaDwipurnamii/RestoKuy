<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use Illuminate\Support\Facades\DB;

class TransaksiApiController extends Controller
{
    // 🔹 Ambil semua transaksi (beserta member & details)
    public function index(Request $request)
    {
        $query = Transaksi::with(['member', 'details.product']);

        // 🔍 Filter berdasarkan nama member
        if ($request->filled('member')) {
            $query->whereHas('member', function ($q) use ($request) {
                $q->where('nama', 'like', "%{$request->member}%");
            });
        }

        // 📅 Filter berdasarkan tanggal
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        // 🔹 Ambil data dengan pagination (misal 5 per halaman)
        $perPage = $request->get('per_page', 5);
        $data = $query->orderBy('tanggal', 'desc')->paginate($perPage);

        // 🔄 Mapping tiap item agar struktur JSON tetap rapi
        $data->getCollection()->transform(function ($t) {
            $produkList = $t->details->map(function ($d) {
                return $d->product->name ?? '-';
            })->implode(', ');

            return [
                'id' => $t->id,
                'member_nama' => $t->member->nama ?? '-',
                'product_nama' => $produkList ?: '-',
                'tanggal' => $t->tanggal,
                'total' => $t->total,
                'status_pembayaran' => $t->status_pembayaran,
                'payment_method' => $t->payment_method,
                'details' => $t->details->map(function ($d) {
                    return [
                        'product_nama' => $d->product->name ?? '-',
                        'qty' => $d->qty,
                        'subtotal' => $d->subtotal,
                    ];
                }),
            ];
        });

        // 🔹 Kembalikan JSON lengkap (ada pagination meta)
        return response()->json($data);
    }

    // 🔹 Detail satu transaksi
    public function show($id)
    {
        $t = Transaksi::with(['member', 'details.product'])->find($id);

        if (!$t) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        return response()->json([
            'id' => $t->id,
            'member_nama' => $t->member->nama ?? '-',
            'tanggal' => $t->tanggal,
            'total' => $t->total,
            'status_pembayaran' => $t->status_pembayaran,
            'payment_method' => $t->payment_method,
            'details' => $t->details->map(function ($d) {
                return [
                    'product_nama' => $d->product->name ?? '-',
                    'qty' => $d->qty,
                    'subtotal' => $d->subtotal,
                ];
            }),
        ]);
    }

    // 🔹 Simpan transaksi baru (checkout banyak produk)
    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'total' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,product_id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // 🔹 Simpan transaksi utama
            $transaksi = Transaksi::create([
                'member_id' => $request->member_id,
                'tanggal' => now(),
                'total' => $request->total,
                'status_pembayaran' => $request->payment_method === 'QRIS' ? 'valid' : 'pending',
                'payment_method' => $request->payment_method,
            ]);


            // 🔹 Simpan detail produk
            foreach ($request->items as $item) {
                TransaksiDetail::create([
                    'transaksi_id' => $transaksi->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil disimpan',
                'data' => $transaksi->load('details.product')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan transaksi',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // 🔹 Validasi pembayaran
    public function validasi($id)
    {
        $transaksi = Transaksi::find($id);

        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        $transaksi->status_pembayaran = 'valid';
        $transaksi->save();

        return response()->json(['message' => 'Transaksi berhasil divalidasi']);
    }
// Backup Harian
public function backupDaily()
{
    $tanggal = now()->toDateString();

    $transaksi = Transaksi::with(['member', 'details.product'])
        ->whereDate('tanggal', $tanggal)
        ->get();

    if ($transaksi->isEmpty()) {
        return response()->json(['message' => 'Tidak ada data transaksi hari ini.'], 404);
    }

    $filename = "backup_transaksi_harian_{$tanggal}.csv";
    $filepath = storage_path("app/public/{$filename}");

    $file = fopen($filepath, 'w');
    fputcsv($file, ['Tanggal', 'Nama Member', 'Nama Produk', 'Total Harga']);

    foreach ($transaksi as $t) {
        // kalau ada banyak detail produk, loop semuanya
        foreach ($t->details as $d) {
            fputcsv($file, [
                $t->tanggal,
                $t->member->nama ?? '-',
                $d->product->name ?? '(produk tidak ditemukan)',
                $d->subtotal ?? 0
            ]);
        }

        // kalau mau nambah total transaksi juga (opsional)
        fputcsv($file, [
            $t->tanggal,
            $t->member->nama ?? '-',
            'TOTAL TRANSAKSI',
            $t->total ?? 0
        ]);
    }

    fclose($file);

    return response()->download($filepath);
}



// Backup Bulanan
public function backupMonthly()
{
    $bulan = now()->month;
    $tahun = now()->year;

    $transaksi = Transaksi::with(['member', 'details.product'])
        ->whereMonth('tanggal', $bulan)
        ->whereYear('tanggal', $tahun)
        ->get();

    if ($transaksi->isEmpty()) {
        return response()->json(['message' => 'Tidak ada data transaksi bulan ini.'], 404);
    }

    $filename = "backup_transaksi_bulanan_{$tahun}_{$bulan}.csv";
    $filepath = storage_path("app/public/{$filename}");

    $file = fopen($filepath, 'w');
    fputcsv($file, ['Tanggal', 'Nama Member', 'Nama Produk', 'Qty', 'Subtotal', 'Total Transaksi']);

    foreach ($transaksi as $t) {
        $totalTransaksi = $t->details->sum('subtotal');

        if ($t->details->isEmpty()) {
            fputcsv($file, [
                $t->tanggal,
                $t->member->nama ?? '-',
                '-',
                0,
                0,
                $totalTransaksi,
            ]);
        } else {
            foreach ($t->details as $d) {
                fputcsv($file, [
                    $t->tanggal,
                    $t->member->nama ?? '-',
                    $d->product->name ?? '(produk tidak ditemukan)',
                    $d->qty ?? 0,
                    $d->subtotal ?? 0,
                    $totalTransaksi,
                ]);
            }
        }
    }

    fclose($file);
    return response()->download($filepath);
}
}