<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksis';

    protected $fillable = [
        'member_id',
        'tanggal',
        'total',
        'status_pembayaran',
        'payment_method',
    ];

    // Relasi ke Member
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }

    // Relasi ke Product (satu produk per transaksi)
   public function product()
    {
       return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function details()
    {
        return $this->hasMany(TransaksiDetail::class, 'transaksi_id', 'id');
    }

}
