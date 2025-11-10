<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');

        $query = Product::with('category');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(10);

        // ✅ Tambahkan img_url absolute untuk setiap produk
        $products->getCollection()->transform(function ($product) {
            $product->img_url = $product->img
                ? url($product->img)
                : null;
            return $product;
        });

        return ProductResource::collection($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric',
            'stock' => 'required|integer|min:0',
            'img' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imgPath = null;
        if ($request->hasFile('img')) {
            $filename = Str::slug($validated['name']) . '_' . time() . '.' . $request->file('img')->getClientOriginalExtension();
            $path = $request->file('img')->storeAs('', $filename, 'public');
            $imgPath = 'storage/' . $path;
        }

        $slug = Str::slug($validated['name']);
        $count = Product::where('slug', 'LIKE', "{$slug}%")->count();
        if ($count > 0) {
            $slug .= '-' . ($count + 1);
        }

        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'img' => $imgPath,
            'slug' => $slug
        ]);

        // ✅ Tambahkan properti img_url agar React langsung bisa pakai
        $product->img_url = $imgPath ? url($imgPath) : null;

        return response()->json([
            'message' => 'Produk berhasil ditambahkan!',
            'data' => $product
        ]);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'img' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imgPath = $product->img;

        if ($request->hasFile('img')) {
            if ($imgPath && Storage::disk('public')->exists(str_replace('storage/', '', $imgPath))) {
                Storage::disk('public')->delete(str_replace('storage/', '', $imgPath));
            }

            $filename = Str::slug($validated['name']) . '_' . time() . '.' . $request->file('img')->getClientOriginalExtension();
            $path = $request->file('img')->storeAs('', $filename, 'public');
            $imgPath = 'storage/' . $path;
        }

        $product->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'img' => $imgPath,
            'slug' => Str::slug($validated['name']),
        ]);

        // ✅ Tambahkan img_url biar React langsung bisa render
        $product->img_url = $imgPath ? url($imgPath) : null;

        return response()->json([
            'message' => 'Produk berhasil diperbarui!',
            'data' => $product
        ]);
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }

        if ($product->img && Storage::disk('public')->exists(str_replace('storage/', '', $product->img))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $product->img));
        }

        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus!']);
    }
}
