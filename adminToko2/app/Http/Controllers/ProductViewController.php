<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductViewController extends Controller
{
    /**
     * Tampilkan daftar produk
     */
    public function index(Request $request)
    {
        $title = "Daftar Produk";
        $query = Product::with('category');

        // 🔍 Pencarian berdasarkan nama produk
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // 🏷️ Filter berdasarkan kategori
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category_id', $request->category);
        }

        $products = $query->paginate(5);
        $categories = \App\Models\Category::all();

        return view('admin.daftarproduk', compact('title', 'products', 'categories'));
    }


    /**
     * Form tambah produk
     */
    public function create()
    {
        $title = "Tambah Produk";
        $categories = Category::all();
        return view('admin.inputproduk', compact('title', 'categories'));
    }

    /**
     * Simpan produk baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric',
            'stock' => 'required|numeric|min:0',
            'img' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Generate slug dari nama
        $validated['slug'] = Str::slug($validated['name'], '-');

        if ($request->hasFile('img')) {
            $validated['img'] = $request->file('img')->store('uploads/products', 'public');
        }

        Product::create($validated);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil ditambahkan!');
    }

    /**
     * Form edit produk
     */
    public function edit(Product $produk)
    {
        $title = "Edit Produk";
        $categories = Category::all();
        return view('admin.inputproduk', [
            'title' => $title,
            'product' => $produk,
            'categories' => $categories
        ]);
    }

    /**
     * Update produk
     */

    public function update(Request $request, Product $produk)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric',
            'stock' => 'required|numeric|min:0',
            'img' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name'], '-');

        if ($request->hasFile('img')) {
            $validated['img'] = $request->file('img')->store('uploads/products', 'public');
        }

        $produk->update($validated);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil diperbarui!');
    }

    /**
     * Hapus produk
     */
    public function destroy(Product $produk)
    {
        $produk->delete();
        return redirect()->route('produk.index')->with('success', 'Produk berhasil dihapus!');
    }
}
