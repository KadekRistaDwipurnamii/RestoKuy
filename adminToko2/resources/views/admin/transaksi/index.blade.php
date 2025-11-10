@extends('layouts.admin-layout')

@section('content')
<style>
    /* ====== STYLE KOMPAK HALAMAN TRANSAKSI ====== */
    body {
        font-family: 'Poppins', sans-serif;
    }

    .content-wrapper {
        padding: 1.5rem 2rem;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin: 1.5rem;
    }

    h1 {
        font-size: 1.7rem;
        font-weight: 800;
        margin-bottom: 0.8rem;
        color: #111;
        text-align: center;
    }

    .form-section {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        justify-content: center;
        margin-bottom: 1.2rem;
    }

    label {
        font-weight: 600;
        color: #111;
        margin-right: 0.3rem;
    }

    input[type="text"],
    input[type="date"] {
        border: 2px solid #000;
        padding: 0.4rem 0.6rem;
        border-radius: 10px;
        box-shadow: 2px 2px 0 #000;
        font-size: 0.9rem;
    }

    button, .btn {
        background: #fff;
        border: 2px solid #000;
        padding: 0.45rem 1.1rem;
        border-radius: 18px;
        font-weight: 600;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        box-shadow: 2px 2px 0 #000;
        transition: all 0.2s;
    }

    button:hover, .btn:hover {
        background: #007bff;
        color: #fff;
        box-shadow: 1px 1px 0 #000;
        transform: translateY(1px);
    }

    .btn-backup {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.3rem;
    }

    .btn-backup a {
        background: #fff;
        border: 2px solid #000;
        padding: 0.55rem 1.3rem;
        border-radius: 20px;
        box-shadow: 3px 3px 0 #000;
        text-decoration: none;
        font-weight: bold;
        color: #000;
        font-size: 0.9rem;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .btn-backup a:hover {
        background: #007bff;
        color: #fff;
        box-shadow: 1px 1px 0 #000;
        transform: translateY(1px);
    }

    h2 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-top: 0.5rem;
        margin-bottom: 0.6rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid #000;
        margin-top: 0.3rem;
        font-size: 0.9rem;
    }

    th, td {
        border: 1px solid #000;
        text-align: center;
        padding: 6px 8px;
    }

    th {
        background-color: #f5f5f5;
        font-weight: 700;
        text-transform: capitalize;
    }

    tr:nth-child(even) {
        background-color: #fafafa;
    }

    tr:hover {
        background-color: #e9f3ff;
        transition: 0.2s;
    }
</style>

<div class="content-wrapper">
    <h1>DATA TRANSAKSI</h1>

    <!-- FORM FILTER -->
    <form method="GET" action="{{ route('admin.transaksi.index') }}" class="form-section">
        <div>
            <label for="member">Member</label>
            <input type="text" name="member" id="member" value="{{ request('member') }}">
        </div>
        <div>
            <label for="tanggal">Tanggal</label>
            <input type="date" name="tanggal" id="tanggal" value="{{ request('tanggal') }}">
        </div>
        <button type="submit">🔍 Cari</button>
        <a href="{{ route('admin.transaksi.index') }}" class="btn">🔄 Reset</a>
    </form>

    <!-- BACKUP BUTTONS -->
    <div class="btn-backup">
        <a href="{{ route('admin.backup.daily') }}">📅 Backup Harian</a>
        <a href="{{ route('admin.backup.monthly') }}">📆 Backup Bulanan</a>
    </div>

    <!-- TABEL TRANSAKSI -->
    <h2>Daftar Transaksi</h2>
    <table>
        <thead>
            <tr>
                <th>Member</th>
                <th>Produk</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transaksis as $t)
            <tr>
                <td>{{ $t->member->nama ?? '-' }}</td>

                <td>
                    @if(isset($t->product) && $t->product)
                        {{ $t->product->name }}
                    @elseif(isset($t->produk))
                        {{ $t->produk }}
                    @else
                        -
                    @endif
                </td>

                <td>{{ $t->tanggal }}</td>
                <td>Rp{{ number_format($t->total, 0, ',', '.') }}</td>
                <td>{{ $t->status_pembayaran }}</td>
                <td>
                    <a href="{{ route('admin.transaksi.show', $t->id) }}" class="btn">Detail</a>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6">Tidak ada transaksi ditemukan.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
