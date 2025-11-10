@extends('layouts.admin-layout')

@section('content')
    <h1 class="text-2xl font-semibold mb-6">Daftar Produk</h1>

    <div class="bg-white shadow-md rounded-lg p-6">
        <a href="{{ route('produk.create') }}"
           class="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block hover:bg-blue-700">
           Tambah Produk
        </a>

        <form method="GET" action="{{ route('produk.index') }}" class="mb-4 flex items-center space-x-2">
            <input type="text" name="search" value="{{ request('search') }}"
                   placeholder="Cari produk..." 
                   class="border px-3 py-2 rounded w-1/3">

            <select name="category" class="border px-3 py-2 rounded">
                <option value="">Semua Kategori</option>
                @foreach($categories as $category)
                    <option value="{{ $category->category_id }}" 
                        {{ request('category') == $category->category_id ? 'selected' : '' }}>
                        {{ $category->category }}
                    </option>
                @endforeach
            </select>

            <button type="submit" 
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Filter
            </button>

            @if(request()->has('search') || request()->has('category'))
                <a href="{{ route('produk.index') }}" 
                   class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Reset</a>
            @endif
        </form>

        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-100 text-left">
                    <th class="py-3 px-4">Nama</th>
                    <th class="py-3 px-4">Kategori</th>
                    <th class="py-3 px-4">Harga</th>
                    <th class="py-3 px-4">Stok</th>
                    <th class="py-3 px-4">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @foreach($products as $product)
                    <tr class="border-b hover:bg-gray-50">
                        <td class="py-3 px-4">{{ $product->name }}</td>
                        <td class="py-3 px-4">{{ $product->category->category ?? '-' }}</td>
                        <td class="py-3 px-4">{{ number_format($product->price, 0, ',', '.') }}</td>
                        <td class="py-3 px-4">{{ $product->stock }}</td>
                        <td class="py-3 px-4">
                            <a href="{{ route('produk.edit', $product->product_id) }}"
                               class="text-blue-600 hover:underline">Edit</a>
                            <form action="{{ route('produk.destroy', $product->product_id) }}" 
                                  method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="text-red-600 hover:underline ml-2">Hapus</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
