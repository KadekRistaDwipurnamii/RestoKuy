<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_id'; // ← WAJIB
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'product_id',
        'name',
        'description',
        'category_id',
        'price',
        'img',
        'stock',
        'slug',
    ];

    // Relasi ke Member
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }

   // public function product()
   // {
   //     return $this->belongsTo(Product::class, 'product_id', 'product_id');
   // }

        public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}


