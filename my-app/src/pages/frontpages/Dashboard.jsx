// src/pages/frontpages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../utils/CartContext";

export default function Dashboard() {
  const { selectedCategory = "All", searchTerm = "" } = useOutletContext() || {};
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((res) => {
        // console.log untuk debugging
        console.log("API /products ->", res.data);
        setProducts(res.data.data || res.data || []);
      })
      .catch((err) => {
        console.error("Gagal ambil produk:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (product) => {
    // cek beberapa kemungkinan field
    const raw = (product && (product.img_url || product.img || product.image)) || null;

    if (!raw) {
      // fallback lokal (assets placeholder) — pastikan file /public/assets/placeholder.jpg ada
      return "/assets/placeholder.jpg";
    }

    // Jika sudah URL absolute
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      return raw;
    }

    // Jika value diawali "storage/" (kamu menyimpan 'storage/xxxx.jpg' di DB)
    if (raw.startsWith("storage/")) {
      return `http://127.0.0.1:8000/${raw}`; // => http://127.0.0.1:8000/storage/...
    }

    // Jika value adalah nama file atau path tanpa "storage/"
    // gunakan /storage/<filename>
    return `http://127.0.0.1:8000/storage/${raw}`;
  };

  const filteredProducts = (products || []).filter((p) => {
    const categoryName =
      (p.category?.name ||
        p.category_name || // kalau API kirim langsung "category_name"
        p.category ||
        p.category_id ||
        "").toString().toLowerCase();

    const matchCategory =
      selectedCategory === "All" ||
      categoryName === selectedCategory.toLowerCase();

    const matchSearch = (p.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    console.log("SelectedCategory:", selectedCategory);
    console.log("Sample product:", products[0]);

    return matchCategory && matchSearch;
  });


  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Memuat produk...</p>;
  }

  return (
    <div className="p-6 bg-[#FFF8F0] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🍽️ Menu RestoKuy
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center">
          Produk tidak ditemukan. Coba ubah kategori atau kata kunci pencarian.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // product.price kadang string; buat Number aman
            const priceNumber = Number(product.price || 0);

            return (
              <div
                key={product.id ?? product.product_id}
                className="border rounded-2xl p-4 shadow-md hover:shadow-xl transition bg-white flex flex-col"
              >
                <Link to={`/product/${product.id ?? product.product_id}`} className="block">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded-xl"
                    onError={(e) => {
                      // kalau error (403/404), tampilkan fallback
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/placeholder.jpg";
                    }}
                  />

                  <h2 className="font-semibold text-lg text-gray-800 mb-1 hover:text-[#E63946] transition">
                    {product.name}
                  </h2>
                </Link>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="font-semibold text-[#E63946] text-base mb-3">
                  Rp {priceNumber.toLocaleString("id-ID")}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto bg-[#FFD166] text-gray-800 px-3 py-2 rounded-lg hover:bg-[#E63946] hover:text-white transition"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
