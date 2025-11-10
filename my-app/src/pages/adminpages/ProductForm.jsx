import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../../utils/ProductContext";

export default function ProductForm() {
  const navigate = useNavigate();
  const { addProduct, getCategories } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    description: "",
    img: null,
  });
  const [errors, setErrors] = useState({});

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama produk wajib diisi";
    if (!formData.category_id)
      newErrors.category_id = "Kategori wajib dipilih";
    if (!formData.price) newErrors.price = "Harga produk wajib diisi";
    else if (isNaN(formData.price))
      newErrors.price = "Harga harus berupa angka";
    if (!formData.stock) newErrors.stock = "Stok produk wajib diisi";
    else if (isNaN(formData.stock))
      newErrors.stock = "Stok harus berupa angka";
    if (!formData.img) newErrors.img = "File harus berupa gambar";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("⚠️ Periksa kembali data yang dimasukkan.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      const res = await addProduct(data);
      if (res.status === 200 || res.status === 201) {
        toast.success("✅ Produk berhasil ditambahkan!");
        navigate("/admin/dashboard");
      }
    } catch {
      toast.error("❌ Gagal menyimpan produk.");
    }
  };

  if (catLoading) return <p>Memuat kategori...</p>;

  const inputClass = (field) =>
    `border rounded p-2 w-full focus:outline-none ${
      errors[field]
        ? "border-red-500 bg-red-50 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Tambah Produk
      </h2>

      {/* Nama Produk */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputClass("name")}
          placeholder="Masukkan nama produk"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className={inputClass("category_id")}
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
        )}
      </div>

      {/* Harga */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Harga (Rp)
        </label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={inputClass("price")}
          placeholder="Masukkan harga produk"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>

      {/* Stok */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stok
        </label>
        <input
          type="text"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className={inputClass("stock")}
          placeholder="Jumlah stok produk"
        />
        {errors.stock && (
          <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={inputClass("description")}
          placeholder="Tuliskan deskripsi produk"
        />
      </div>

      {/* Gambar Produk */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gambar Produk
        </label>
        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleChange}
          className={inputClass("img")}
        />
        {errors.img && (
          <p className="text-red-500 text-sm mt-1">{errors.img}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
      >
        Simpan Produk
      </button>
    </form>
  );
}
