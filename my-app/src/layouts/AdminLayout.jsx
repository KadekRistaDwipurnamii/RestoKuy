import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="text-center py-6 text-2xl font-bold border-b border-blue-500">
          🛍️ Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? "bg-blue-500" : "hover:bg-blue-600"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/transaksi"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? "bg-blue-500" : "hover:bg-blue-600"
              }`
            }
          >
            Transaksi
          </NavLink>

          {/* ✅ Tambah Produk (menu baru) */}
          <NavLink
            to="/admin/add-product"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? "bg-blue-500" : "hover:bg-blue-600"
              }`
            }
          >
            Tambah Produk
          </NavLink>

          <NavLink
            to="/admin/about"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? "bg-blue-500" : "hover:bg-blue-600"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/admin/support"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md ${
                isActive ? "bg-blue-500" : "hover:bg-blue-600"
              }`
            }
          >
            Support
          </NavLink>
        </nav>

        {/* Logout di bawah */}
        <div className="p-4 border-t border-blue-500 mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="w-full text-center bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>
          <div className="text-sm text-gray-600">Selamat datang, Admin 👋</div>
        </header>
        <section className="bg-white shadow-md rounded-lg p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
