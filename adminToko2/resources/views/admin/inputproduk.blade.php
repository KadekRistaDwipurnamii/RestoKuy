@extends('layouts.admin-layout')

@section('content')
    <h1 class="text-2xl font-semibold mb-6">{{ $title }}</h1>

    <form action="{{ isset($product) ? route('produk.update', $product->product_id) : route('produk.store') }}"
          method="POST" enctype="multipart/form-data"
          class="bg-white shadow-md rounded-lg p-6 space-y-4">
        @csrf
        @if(isset($product))
            @method('PUT')
        @endif

        <div>
            <label for="name" class="block font-medium">Nama Produk</label>
            <input type="text" id="name" name="name"
                   value="{{ old('name', $product->name ?? '') }}"
                   class="w-full border rounded p-2 focus:ring focus:ring-blue-300">
        </div>

        <div>
            <label for="category_id" class="block font-medium">Kategori</label>
            <select id="category_id" name="category_id"
                    class="w-full border rounded p-2 focus:ring focus:ring-blue-300">
                <option value="">-- Pilih Kategori --</option>
                @foreach($categories as $category)
                    <option value="{{ $category->category_id }}"
                        {{ old('category_id', $product->category_id ?? '') == $category->category_id ? 'selected' : '' }}>
                        {{ $category->category }}
                    </option>
                @endforeach
            </select>
        </div>

        <div>
            <label for="price" class="block font-medium">Harga</label>
            <input type="number" id="price" name="price"
                   value="{{ old('price', $product->price ?? '') }}"
                   class="w-full border rounded p-2 focus:ring focus:ring-blue-300">
        </div>

        <div>
            <label for="stock" class="block font-medium">Stok</label>
            <input type="number" id="stock" name="stock"
                   value="{{ old('stock', $product->stock ?? '') }}"
                   class="w-full border rounded p-2 focus:ring focus:ring-blue-300">
        </div>

        <div>
            <label for="img" class="block font-medium">Gambar</label>
            <input type="file" id="img" name="img"
                   class="w-full border rounded p-2 focus:ring focus:ring-blue-300">
            @if(isset($product) && $product->img)
                <img src="{{ asset('storage/' . $product->img) }}" alt="Preview"
                     class="w-24 mt-2 rounded">
            @endif
        </div>

        <button type="submit"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Simpan
        </button>
    </form>
@endsection
