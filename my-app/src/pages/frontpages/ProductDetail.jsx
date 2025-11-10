// src/pages/frontpages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../utils/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data.data || res.data);
      })
      .catch((err) => console.error("Gagal ambil detail produk:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Memuat produk...</p>;
  if (!product) return <p className="text-center mt-10">Produk tidak ditemukan.</p>;

  const total = (product.price || 0) * quantity;

  return (
    <div className="p-6 bg-[#FFF8F0] min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-lg w-full">
        {/* Gambar produk */}
        <img
          src={
            product.img_url ||
            (product.img ? `http://127.0.0.1:8000/storage/${product.img}` : "/no-image.jpg")
          }
          alt={product.name}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />

        {/* Nama dan kategori */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{product.name}</h1>
        <p className="text-gray-500 text-sm mb-1">
          {product.category?.name || "Kategori tidak tersedia"}
        </p>

        {/* Rating */}
        <p className="text-yellow-500 text-lg mb-2">⭐⭐⭐⭐⭐</p>

        {/* Deskripsi */}
        <p className="text-gray-600 mb-2">{product.description}</p>

        {/* Harga */}
        <p className="font-semibold text-[#E63946] text-xl mb-4">
          Rp {product.price?.toLocaleString("id-ID")}
        </p>

        {/* Jumlah dan total */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Jumlah:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border border-gray-300 rounded-lg p-1 text-center"
          />
        </div>

        <p className="font-semibold text-gray-700 mb-4">
          Total: Rp {total.toLocaleString("id-ID")}
        </p>

        {/* Tombol aksi */}
        <div className="flex gap-3">
          <button
            onClick={() => addToCart({ ...product, quantity })}
            className="bg-[#FFD166] text-gray-800 px-4 py-2 rounded-lg hover:bg-[#E63946] hover:text-white transition w-1/2"
          >
            Tambah ke Keranjang
          </button>
          <button
            onClick={() => {
              addToCart({ ...product, quantity });
              navigate("/checkout");
            }}
            className="bg-[#06D6A0] text-white px-4 py-2 rounded-lg hover:bg-[#118AB2] transition w-1/2"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
