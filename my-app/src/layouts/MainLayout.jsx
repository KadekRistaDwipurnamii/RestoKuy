import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../utils/UserContext";
import { toast } from "react-hot-toast";

export default function MainLayout() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    toast.success("Berhasil logout!");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8F0]">
      {/* Navbar */}
      <header className="bg-[#E63946] text-white p-4 flex justify-between items-center shadow-md">
        {/* Logo */}
        <h1 className="font-bold text-2xl tracking-wide">🍴 RestoKuy</h1>

        {/* Menu Navigasi */}
        <nav className="flex gap-6 text-lg">
          <Link to="/" className="hover:text-[#FFD166] transition">
            Dashboard
          </Link>
          <Link to="/cart" className="hover:text-[#FFD166] transition">
            Keranjang
          </Link>
          <Link to="/checkout" className="hover:text-[#FFD166] transition">
            Checkout
          </Link>
        </nav>

        {/* Search + Dropdown + User */}
        <div className="flex gap-3 items-center">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Cari menu..."
            className="px-3 py-1 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Dropdown Kategori */}
          <select
            className="px-3 py-1 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
          </select>

          {/* Tombol Login / Logout */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-medium">Halo, {user.nama}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Isi Halaman */}
      <main className="flex-grow p-6">
        <Outlet context={{ selectedCategory, searchTerm }} />
      </main>

      {/* Footer */}
      <footer className="bg-[#E63946] text-white text-center py-3 mt-auto rounded-t-lg">
        © 2025 RestoKuy. All rights reserved.
      </footer>
    </div>
  );
}
