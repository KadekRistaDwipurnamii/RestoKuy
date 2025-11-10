import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";
import toast from "react-hot-toast";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // 🔹 Ambil semua produk dari API Laravel
  const fetchProducts = async ({ queryKey }) => {
    const params = queryKey[1] || {};
    const { page = 1, limit = 10, category_id = "", keyword = "" } = params;
    const res = await apiClient.get(
      `/products?page=${page}&limit=${limit}&category_id=${category_id}&keyword=${keyword}`
    );

    // Laravel pagination biasanya mengembalikan { data: [...] }
    const data = res.data?.data;
    return Array.isArray(data) ? data : data?.data || [];
  };

  // 🔹 React Query v5 format
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", { page: 1, limit: 10 }],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  // 🔹 Ambil detail produk
  const getProductById = async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data ?? res.data;
  };

  // 🔹 Ambil kategori produk
  const getCategories = async () => {
    const res = await apiClient.get("/categories");
    const data = res.data.data || res.data || [];
    return Array.isArray(data) ? data : [];
  };


  // 🔹 Tambah produk
  const addProduct = async (formData) => {
    const res = await apiClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    return res;
  };

  // 🔹 Update produk
  const updateProduct = async (id, formData) => {
    const res = await apiClient.post(`/products/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    return res;
  };

  // 🔹 Hapus produk
  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/products/${id}`);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "✅ Produk berhasil dihapus!");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "❌ Gagal menghapus produk. Coba lagi."
      );
    },
  });

  // 🔹 Return Context Provider
  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        isError,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// 🔹 Hook custom
export const useProducts = () => useContext(ProductContext);
