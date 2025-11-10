<x-admin-layout>
    @section('content')
        <h1 class="text-2xl font-semibold mb-6">Profil Pengguna</h1>

        <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
            <p><strong>Nama:</strong> {{ Auth::user()->name ?? 'Rista Purnami' }}</p>
            <p><strong>Email:</strong> {{ Auth::user()->email ?? 'ristapurn@gmail.com' }}</p>
            <p><strong>Role:</strong> Admin</p>

            <a href="#"
               class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-1000">Edit Profil</a>
        </div>
    @endsection
</x-admin-layout>
