<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel Admin') }}</title>

    <!-- Tailwind -->
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    <!-- Font Awesome -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

    <!-- Alpine -->
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
            defer></script>

    <style>
        body { font-family: 'Karla', sans-serif; }
        .bg-sidebar { background-color: #3d68ff; }
        .hover-bg:hover { background-color: #2f56e 8; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex">

<!-- SIDEBAR -->
<aside class="bg-sidebar text-white w-64 h-screen fixed top-0 left-0 flex flex-col shadow-lg z-30">
    <div class="p-6">
        <h1 class="text-3xl font-bold uppercase mb-6">ADMIN</h1>
    </div>
    <nav class="flex-1 px-4 space-y-2">
        <a href="{{ route('dashboard') }}" class="flex items-center py-3 px-3 hover-bg rounded transition">
            <i class="fas fa-tachometer-alt mr-3"></i> Dashboard
        </a>
        <a href="{{ route('produk.index') }}" class="flex items-center py-3 px-3 hover-bg rounded transition">
            <i class="fas fa-box mr-3"></i> Produk</a>
        <a href="{{ route('produk.create') }}" class="flex items-center py-3 px-3 hover-bg rounded transition">
            <i class="fas fa-plus-circle mr-3"></i> Tambah Produk</a>
        <a href="{{ route('logout') }}" class="flex items-center py-3 px-3 hover-bg rounded transition">
            <i class="fas fa-sign-out-alt mr-3"></i> Logout</a>
    </nav>
</aside>

<!-- MAIN CONTENT -->
<div class="flex-1 min-h-screen pl-64 flex flex-col bg-gray-100">
    <!-- HEADER -->
    <header class="bg-white shadow p-4 flex justify-end items-center">
        <div x-data="{ open: false }" class="relative">
            <button @click="open =!open"
                    class="flex items-center focus:outline-none space-x-2">
                <img src="https://static.vecteezy.com/system/resources/previews/019/495/202/original/business-woman-girl-avatar-user-person-people-straight-hair-flat-style-vector.jpg"
                     alt="User Avatar"
                     class="w-10 h-10 rounded-full border">
                <span class="text-gray-700 font-medium">User</span>
                <i class="fa-solid fa-chevron-down text-gray-500 text-sm"></i>
            </button>
            <div x-show="open" @click.away="open = false"
            class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
            <a href="{{ route('admin.account') }}"
            class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
            Account
            </a>
            <a href="{{ route('admin.support') }}"
            class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
            Support
            </a>
            <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit"
                    class="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                Sign Out
            </button>
        </form>
        </div>
        </div>
    </header>

    <!-- PAGE CONTENT -->
    <main class="flex-grow p-8 overflow-x-auto">
        @yield('content')
    </main>

    <!-- FOOTER -->
    <footer class="bg-white text-right py-4 px-6 text-sm text-gray-600 border-t">
        Built by <a href="https://davidgrzyb.com" target="_blank" class="underline">David Grzyb</a>.
    </footer>
</div>
</body>
</html>
