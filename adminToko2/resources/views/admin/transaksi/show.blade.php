@extends('layouts.admin-layout')

@section('content')
<style>
    /* === STYLE DETAIL TRANSAKSI === */
    .detail-container {
        background: #fff;
        border-radius: 16px;
        padding: 2rem 2.5rem;
        margin: 2rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 550px;
    }

    h1 {
        font-size: 1.6rem;
        font-weight: 800;
        color: #111;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.4rem 0;
        border-bottom: 1px solid #e5e5e5;
    }

    .detail-item strong {
        font-weight: 700;
        color: #222;
        width: 120px;
    }

    .detail-item span {
        color: #333;
        flex: 1;
        text-align: right;
    }

    .detail-item:last-child {
        border-bottom: none;
    }

    .btn-back {
        display: inline-block;
        margin-top: 1.5rem;
        background: #fff;
        border: 2px solid #000;
        padding: 0.5rem 1.3rem;
        border-radius: 16px;
        box-shadow: 2px 2px 0 #000;
        font-weight: 600;
        text-decoration: none;
        color: #000;
        transition: all 0.2s;
    }

    .btn-back:hover {
        background: #007bff;
        color: #fff;
        transform: translateY(1px);
        box-shadow: 1px 1px 0 #000;
    }

    /* Responsive */
    @media (max-width: 600px) {
        .detail-container {
            margin: 1rem;
            padding: 1.5rem;
        }
        .detail-item strong {
            width: 100px;
        }
    }
</style>

<div class="detail-container">
    <h1>Detail Transaksi</h1>

    <div class="detail-item">
        <strong>Member</strong>
        <span>{{ $transaksi->member->nama ?? '-' }}</span>
    </div>

    <div class="detail-item">
        <strong>Produk</strong>
        <span>{{ $transaksi->product->nama ?? '-' }}</span>
    </div>

    <div class="detail-item">
        <strong>Tanggal</strong>
        <span>{{ $transaksi->tanggal }}</span>
    </div>

    <div class="detail-item">
        <strong>Total</strong>
        <span>Rp{{ number_format($transaksi->total, 0, ',', '.') }}</span>
    </div>

    <div class="detail-item">
        <strong>Status</strong>
        <span>{{ ucfirst($transaksi->status_pembayaran) }}</span>
    </div>

    <a href="{{ route('admin.transaksi.index') }}" class="btn-back">⬅ Kembali</a>
</div>
@endsection
