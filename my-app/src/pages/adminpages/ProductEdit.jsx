import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../utils/ProductContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, getCategories } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    description: "",
    img: null,
  });
  const [errors, setErrors] = useState({});

  // Ambil kategori dari backend
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Ambil data produk untuk prefilling form
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  // Prefill data saat produk sudah dimuat
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        category_id: product.category?.id || "",
        description: product.description || "",
        img: null,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // 🔴 Validasi manual (biar border & teks error bisa muncul)
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
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null) data.append(k, v);
    });

    try {
      const res = await updateProduct(id, data);
      if (res.status === 200 || res.status === 201) {
        toast.success("✅ Produk berhasil diperbarui!");
        navigate("/admin/dashboard");
      }
    } catch {
      toast.error("❌ Gagal menyimpan perubahan produk.");
    }
  };

  if (isLoading) return <p>Memuat data produk...</p>;
  if (isError) return <p>Gagal memuat data produk.</p>;

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
        Edit Produk
      </h2>

      {/* Nama Produk */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Produk
        </label>
        <input
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
            <option key={cat.id} value={cat.id}>
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
          Gambar Produk (biarkan kosong jika tidak diubah)
        </label>
        <input
          type="file"
          name="img"
          accept="image/*"
          onChange={handleChange}
          className={inputClass("img")}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
