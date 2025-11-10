import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../utils/apiClient";

export default function CategoryForm() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const res = await apiClient.post("/categories", { category });

      if (res.status === 200 || res.status === 201) {
        toast.success("✅ Kategori berhasil ditambahkan!");
        setCategory("");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("⚠️ Nama kategori tidak valid!");
      } else {
        toast.error("❌ Gagal menambahkan kategori!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Tambah Kategori
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Kategori
        </label>
        <input
          type="text"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`border rounded p-2 w-full ${
            errors.category ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Masukkan nama kategori..."
          required
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
      >
        {isLoading ? "Menyimpan..." : "Simpan Kategori"}
      </button>
    </form>
  );
}
