<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Tampilkan semua produk di halaman landingpage
    public function index()
    {
        $products = Product::with('category')->get()->map(function ($product) {
            $product->img_url = asset('storage' . $product->img);
            return $product;
        });
        // Jika request datang dari API, kirim JSON
        if (request()->is('api/*')) {
            return response()->json($products);
        }

        // Jika dari web, tampilkan ke view
        return view('frontpages.landingpage', compact('products'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,category_id',
            'img' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('img')) {
            $path = $request->file('img')->store('uploads/product', 'public');
            $validated['img'] = $path;
        }

        Product::create($validated);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil ditambahkan!');
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,category_id',
            'img' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Upload file baru kalau ada
        if ($request->hasFile('img')) {
            $path = $request->file('img')->store('uploads/product', 'public');
            $validated['img'] = $path;
        }

        // Update produk
        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui!',
            'data' => $product
        ]);
    }


    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, 204);
    }
}