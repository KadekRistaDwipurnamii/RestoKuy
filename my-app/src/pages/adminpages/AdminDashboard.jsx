import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [transaksis, setTransaksis] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/transaksis?page=${page}&per_page=5`
      );
      setTransaksis(res.data.data);
      setMeta({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (err) {
      console.error("Gagal fetch transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  const handleValidasi = async (id) => {
    if (!window.confirm("Yakin ingin validasi transaksi ini?")) return;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/transaksis/${id}/validasi`
      );
      alert(response.data.message);
      fetchTransaksi(); // refresh data setelah validasi
    } catch (error) {
      console.error("Gagal validasi:", error);
      alert("Terjadi kesalahan saat validasi transaksi");
    }
  };

  const getFilteredData = () => {
    if (filter === "hari") {
      const today = new Date().toISOString().slice(0, 10);
      return transaksis.filter((t) => t.tanggal === today);
    }
    if (filter === "bulan") {
      const bulan = new Date().toISOString().slice(0, 7);
      return transaksis.filter((t) => t.tanggal.startsWith(bulan));
    }
    return transaksis;
  };

  const filteredData = getFilteredData();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Admin</h1>

      {/* Filter Buttons */}
      <div className="flex justify-between mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => handleFilter("semua")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "semua" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => handleFilter("hari")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "hari" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => handleFilter("bulan")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "bulan" ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading data transaksi...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-gray-700 text-left">
                <th className="p-3 w-12">#</th>
                <th className="p-3 w-40">Member</th>
                <th className="p-3 w-60">Produk</th>
                <th className="p-3 w-32">Tanggal</th>
                <th className="p-3 w-32">Total</th>
                <th className="p-3 w-28">Status</th>
                <th className="p-3 w-28">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((t, index) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{t.member_nama}</td>
                  <td className="p-3">{t.product_nama}</td>
                  <td className="p-3">{t.tanggal}</td>
                  <td className="p-3">Rp {Number(t.total).toLocaleString("id-ID")}</td>

                  {/* Kolom STATUS */}
                  <td
                    className={`p-3 font-medium text-center ${
                      t.status_pembayaran === "valid"
                        ? "text-green-600"
                        : t.status_pembayaran === "pending"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    {t.status_pembayaran
                      ? t.status_pembayaran.charAt(0).toUpperCase() +
                        t.status_pembayaran.slice(1)
                      : "-"}
                  </td>

                  {/* Kolom AKSI */}
                  <td className="p-3 text-center">
                    {t.status_pembayaran === "pending" ? (
                      <button
                        onClick={() => handleValidasi(t.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Validasi
                      </button>
                    ) : t.status_pembayaran === "valid" ? (
                      <span className="text-gray-400 italic">Sudah valid</span>
                    ) : (
                      <span className="text-red-600 italic font-semibold">Gagal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 p-4">
            <button
              disabled={meta.current_page === 1}
              onClick={() => fetchTransaksi(meta.current_page - 1)}
              className={`px-4 py-2 rounded-lg border ${
                meta.current_page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-blue-100"
              }`}
            >
              Sebelumnya
            </button>

            <span className="text-gray-600">
              Halaman {meta.current_page} dari {meta.last_page}
            </span>

            <button
              disabled={meta.current_page === meta.last_page}
              onClick={() => fetchTransaksi(meta.current_page + 1)}
              className={`px-4 py-2 rounded-lg border ${
                meta.current_page === meta.last_page
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-blue-100"
              }`}
            >
              Berikutnya
            </button>
          </div>

          {filteredData.length === 0 && (
            <p className="text-center p-4 text-gray-500">
              Tidak ada data transaksi untuk filter ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
