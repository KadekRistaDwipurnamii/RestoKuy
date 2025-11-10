<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $primaryKey = 'category_id';

    protected $fillable = [
        'category',
    ];

    // Relasi ke produk
    public function produk()
    {
        return $this->hasMany(Product::class, 'category_id', 'category_id');
    }
}
