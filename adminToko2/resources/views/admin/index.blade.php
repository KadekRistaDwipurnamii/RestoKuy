<x-admin-layout>
    @section('content')
    <div class="flex flex-col items-center justify-center h-full mt-20">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to My Admin</h1>
        <p class="text-gray-600 text-lg">
            Manage your products, users, and support from here.
        </p>

        <div class="mt-8 flex justify-center gap-4">
            <a href="{{ route('admin.produk.index') }}"
            class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                Manage Products
            </a>
            <a href="{{ route('admin.account') }}"
            class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                Profile
            </a>
            <a href="{{ route('admin.support') }}"
            class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                Support
            </a>
        </div>

    </div>
    @endsection
</x-admin-layout>
