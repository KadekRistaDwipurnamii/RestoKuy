import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminTransaksi() {
  const [transaksis, setTransaksis] = useState([]);
  const [member, setMember] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });

  // 🔹 Ambil data transaksi dari API Laravel (dengan pagination)
  const fetchTransaksi = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/transaksis", {
        params: {
          member: member,
          tanggal: tanggal,
          page: page,
          per_page: 5, // tampilkan 5 per halaman
        },
      });

      console.log("📦 Data transaksi dari backend:", res.data);

      if (Array.isArray(res.data.data)) {
        setTransaksis(res.data.data);
        setMeta({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
        });
      } else if (Array.isArray(res.data)) {
        // fallback jika backend belum paginate()
        setTransaksis(res.data);
        setMeta({ current_page: 1, last_page: 1 });
      } else {
        setTransaksis([]);
      }
    } catch (error) {
      console.error("❌ Gagal mengambil data transaksi:", error);
      setTransaksis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, [member, tanggal]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransaksi(1);
  };

  const handleReset = () => {
    setMember("");
    setTanggal("");
    setTimeout(() => fetchTransaksi(1), 100);
  };

  const handleBackupHarian = () => {
    window.open("http://127.0.0.1:8000/admin/backup/daily", "_blank");
  };

  const handleBackupBulanan = () => {
    window.open("http://127.0.0.1:8000/admin/backup/monthly", "_blank");
  };

  return (
    <div className="font-[Poppins]">
      <div
        className="p-6 bg-white rounded-2xl shadow-md mx-6 my-6"
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <h1 className="text-[1.7rem] font-extrabold text-center mb-4 text-[#111]">
          DATA TRANSAKSI
        </h1>

        {/* FORM FILTER */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap justify-center items-center gap-3 mb-4"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="member" className="font-semibold text-[#111]">
              Member
            </label>
            <input
              type="text"
              id="member"
              value={member}
              onChange={(e) => setMember(e.target.value)}
              className="border-2 border-black rounded-lg px-3 py-1 shadow-[2px_2px_0_#000]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="tanggal" className="font-semibold text-[#111]">
              Tanggal
            </label>
            <input
              type="date"
              id="tanggal"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="border-2 border-black rounded-lg px-3 py-1 shadow-[2px_2px_0_#000]"
            />
          </div>

          <button
            type="submit"
            className="bg-white border-2 border-black px-4 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1 shadow-[2px_2px_0_#000] hover:bg-blue-600 hover:text-white transition"
          >
            🔍 Cari
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-white border-2 border-black px-4 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1 shadow-[2px_2px_0_#000] hover:bg-blue-600 hover:text-white transition"
          >
            🔄 Reset
          </button>
        </form>

        {/* BACKUP BUTTONS */}
        <div className="flex justify-center gap-4 mb-5">
          <button
            onClick={handleBackupHarian}
            className="bg-white border-2 border-black px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1 shadow-[3px_3px_0_#000] hover:bg-blue-600 hover:text-white transition"
          >
            📅 Backup Harian
          </button>
          <button
            onClick={handleBackupBulanan}
            className="bg-white border-2 border-black px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1 shadow-[3px_3px_0_#000] hover:bg-blue-600 hover:text-white transition"
          >
            📆 Backup Bulanan
          </button>
        </div>

        {/* TABEL TRANSAKSI */}
        <h2 className="text-lg font-bold mb-2">Daftar Transaksi</h2>

        {loading ? (
          <p className="text-gray-500 text-center">Memuat data...</p>
        ) : transaksis.length === 0 ? (
          <p className="text-center font-semibold text-red-500">
            Tidak ada transaksi ditemukan.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black text-sm">
                <thead className="bg-[#f5f5f5]">
                  <tr>
                    <th className="border border-black py-2 px-3">Member</th>
                    <th className="border border-black py-2 px-3">Produk</th>
                    <th className="border border-black py-2 px-3">Tanggal</th>
                    <th className="border border-black py-2 px-3">Total</th>
                    <th className="border border-black py-2 px-3">Status</th>
                    <th className="border border-black py-2 px-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transaksis.map((t, index) => (
                    <tr
                      key={t.id || index}
                      className="hover:bg-[#e9f3ff] transition"
                    >
                      <td className="border border-black py-2 px-3 text-center">
                        {t.member_nama || "-"}
                      </td>
                      <td className="border border-black py-2 px-3 text-center">
                        {t.product_nama || t.product || "-"}
                      </td>
                      <td className="border border-black py-2 px-3 text-center">
                        {t.tanggal}
                      </td>
                      <td className="border border-black py-2 px-3 text-center">
                        Rp{Number(t.total).toLocaleString("id-ID")}
                      </td>
                      <td className="border border-black py-2 px-3 text-center">
                        {t.status_pembayaran}
                      </td>
                      <td className="border border-black py-2 px-3 text-center">
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/transaksi/${t.id}`)
                          }
                          className="bg-white border-2 border-black px-3 py-1 rounded-full font-semibold text-xs flex items-center justify-center gap-1 shadow-[2px_2px_0_#000] hover:bg-blue-600 hover:text-white"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 p-4">
              <button
                disabled={meta.current_page === 1}
                onClick={() => fetchTransaksi(meta.current_page - 1)}
                className={`px-4 py-2 rounded-lg border font-semibold ${
                  meta.current_page === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-blue-100"
                }`}
              >
                Sebelumnya
              </button>

              <span className="text-gray-700 font-medium">
                Halaman {meta.current_page} dari {meta.last_page}
              </span>

              <button
                disabled={meta.current_page === meta.last_page}
                onClick={() => fetchTransaksi(meta.current_page + 1)}
                className={`px-4 py-2 rounded-lg border font-semibold ${
                  meta.current_page === meta.last_page
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-blue-100"
                }`}
              >
                Berikutnya
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
