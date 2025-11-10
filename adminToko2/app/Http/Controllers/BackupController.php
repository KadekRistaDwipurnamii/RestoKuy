<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use Illuminate\Support\Facades\Response;

class BackupController extends Controller
{
    // Backup Harian
    public function backupHarian()
    {
        $tanggal = now()->toDateString();
        $transaksi = Transaksi::whereDate('created_at', $tanggal)->get();

        if ($transaksi->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada transaksi hari ini.'
            ], 200);
        }

        $fileName = "backup_transaksi_harian_{$tanggal}.csv";
        $csvData = $this->buatCsv($transaksi);

        return Response::make($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}"
        ]);
    }

    // Backup Bulanan
    public function backupBulanan()
    {
        $bulan = now()->format('Y_m');
        $transaksi = Transaksi::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->get();

        if ($transaksi->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada transaksi bulan ini.'
            ], 200);
        }

        $fileName = "backup_transaksi_bulanan_{$bulan}.csv";
        $csvData = $this->buatCsv($transaksi);

        return Response::make($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}"
        ]);
    }

    // Fungsi pembuat CSV sederhana
    private function buatCsv($data)
    {
        $csv = '';
        $header = array_keys($data->first()->toArray());
        $csv .= implode(',', $header) . "\n";

        foreach ($data as $row) {
            $csv .= implode(',', $row->toArray()) . "\n";
        }

        return $csv;
    }
}
