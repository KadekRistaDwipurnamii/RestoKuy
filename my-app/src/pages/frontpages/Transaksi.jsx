// src/pages/frontpages/Transaksi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Transaksi() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/transaksis")
      .then((res) => {
        console.log("Data transaksi:", res.data);
        // Ambil koleksi data dari Laravel pagination
        setTransactions(res.data.data || []);
      })
      .catch((err) => {
        console.error("Gagal ambil transaksi:", err);
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Memuat transaksi...</p>;
  }

  return (
    <div className="p-6 bg-[#FFF8F0] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🧾 Riwayat Transaksi</h1>
        <Link
          to="/"
          className="bg-[#E63946] text-white px-4 py-2 rounded-lg hover:bg-[#FFD166] hover:text-gray-800 transition"
        >
          ⬅️ Kembali ke Dashboard
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center">
          Belum ada transaksi. Silakan lakukan pembelian terlebih dahulu.
        </p>
      ) : (
        <div className="space-y-4">
          {transactions.map((trx) => (
            <div
              key={trx.id}
              className="border rounded-2xl shadow-md bg-white p-5"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Transaksi #{trx.id}
                </h2>
                <span className="text-sm text-gray-500">
                  {trx.tanggal
                    ? new Date(trx.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Tanggal tidak tersedia"}
                </span>
              </div>

              <div className="space-y-2">
                {trx.details && trx.details.length > 0 ? (
                  trx.details.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b py-2 text-gray-700"
                    >
                      <span>
                        {item.product_nama} (x{item.qty})
                      </span>
                      <span>
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Tidak ada detail produk</p>
                )}
              </div>

              <div className="mt-3 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>Rp {trx.total.toLocaleString("id-ID")}</span>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Status:{" "}
                <span
                  className={`font-medium ${
                    trx.status_pembayaran === "valid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {trx.status_pembayaran === "valid"
                    ? "Sukses"
                    : "Menunggu Pembayaran"}
                </span>
              </div>

              <div className="mt-1 text-sm text-gray-500">
                Metode:{" "}
                <span className="font-medium">{trx.payment_method}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
