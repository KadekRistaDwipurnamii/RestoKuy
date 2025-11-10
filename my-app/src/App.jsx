// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/frontpages/Dashboard";
import Cart from "./pages/frontpages/Cart";
import Checkout from "./pages/frontpages/Checkout";
import CategoryForm from "./pages/adminpages/CategoryForm";
import AdminDashboard from "./pages/adminpages/AdminDashboard";
import ProductForm from "./pages/adminpages/ProductForm";
import ProductEdit from "./pages/adminpages/ProductEdit";
import ProductDetail from "./pages/frontpages/ProductDetail";
import AdminTransaksi from "./pages/adminpages/AdminTransaksi";
import AdminTransaksiDetail from "./pages/adminpages/AdminTransaksiDetail";
import About from "./pages/adminpages/About";
import Support from "./pages/adminpages/Support";
import Transaksi from "./pages/frontpages/Transaksi";

import { CartProvider } from "./utils/CartContext";
import { UserProvider, useUser } from "./utils/UserContext";

// 🧩 Tambahan baru
import MemberLogin from "./pages/frontpages/MemberLogin";
import Register from "./pages/frontpages/Register"; 

// 🔒 Proteksi route — biar halaman tertentu cuma bisa diakses kalau sudah login
function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Ambil data user dari localStorage (kalau sudah pernah login)
    const saved = localStorage.getItem("member");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoadingUser(false);
  }, []);

  if (loadingUser) return <p>Loading user...</p>;

  return (
    <UserProvider value={{ user, setUser }}>
      <CartProvider>
        <Routes>
          {/* 🏠 FRONTEND */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<MemberLogin />} />
            <Route path="register" element={<Register />} />
            <Route path="/transaksi" element={<Transaksi />} />
            {/* 🛒 Checkout dilindungi login */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route path="product/:id" element={<ProductDetail />} />
          </Route>

          {/* ⚙️ ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-product" element={<ProductForm />} />
            <Route path="edit-product/:id" element={<ProductEdit />} />
            <Route path="categories" element={<CategoryForm />} />
            <Route path="transaksi" element={<AdminTransaksi />} />
            <Route path="transaksi/:id" element={<AdminTransaksiDetail />} />
            <Route path="about" element={<About />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Routes>
      </CartProvider>
    </UserProvider>
  );
}
