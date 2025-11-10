import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminTransaksiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/transaksis/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Gagal ambil detail transaksi:", err);
    }
  };

  const handleValidasi = async () => {
    if (!window.confirm("Yakin ingin validasi transaksi ini?")) return;

    setLoading(true);
    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/transaksis/${id}/validasi`
      );
      alert(res.data.message);
      fetchDetail(); // refresh data
    } catch (err) {
      console.error("Gagal validasi transaksi:", err);
      alert("Terjadi kesalahan saat validasi transaksi");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <p>Memuat detail transaksi...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Detail Transaksi</h2>

      <div className="space-y-2">
        <p>
          <b>Member:</b> {data.member_nama}
        </p>

        <div>
          <b>Produk:</b>
          <ul className="list-disc ml-6">
            {data.details && data.details.length > 0 ? (
              data.details.map((item, idx) => (
                <li key={idx}>
                  {item.product_nama} (Qty: {item.qty}) - Rp
                  {parseInt(item.subtotal).toLocaleString()}
                </li>
              ))
            ) : (
              <li>-</li>
            )}
          </ul>
        </div>

        <p>
          <b>Tanggal:</b> {data.tanggal}
        </p>
        <p>
          <b>Total:</b> Rp{parseInt(data.total).toLocaleString()}
        </p>
        <p>
          <b>Status:</b>{" "}
          {data.status_pembayaran
            ? data.status_pembayaran.charAt(0).toUpperCase() +
              data.status_pembayaran.slice(1)
            : "-"}
        </p>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          ← Kembali
        </button>

        {data.status_pembayaran === "pending" && (
          <button
            onClick={handleValidasi}
            disabled={loading}
            className={`${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded`}
          >
            {loading ? "Memvalidasi..." : "Validasi Pembayaran"}
          </button>
        )}
      </div>
    </div>
  );
}
