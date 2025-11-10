import { useState } from "react";
import { useCart } from "../../utils/CartContext";
import { useUser } from "../../utils/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.qty || 1),
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Keranjang kosong!");
      return;
    }

    if (!user?.id) {
      toast.error("Silakan login terlebih dahulu untuk checkout!");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        member_id: user.id,
        total,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product_id: item.id ?? item.product_id,
          qty: item.qty || 1,
          subtotal: Number(item.price || 0) * (item.qty || 1),
        })),
      };

      const res = await axios.post("http://127.0.0.1:8000/api/checkout", payload);

      toast.success(res.data?.message || "Transaksi berhasil!");
      clearCart();
      navigate("/transaksi");
    } catch (err) {
      console.error("Checkout error detail:", err);

      const serverMessage =
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : JSON.stringify(err.response?.data)) ||
        `Status code: ${err.response?.status || "unknown"}`;

      toast.error("Checkout gagal! " + serverMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 max-w-lg mx-auto bg-[#FFF8F0] min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h2>

      {/* RINGKASAN BELANJA */}
      <div className="border rounded-2xl p-4 mb-6 shadow-md bg-white">
        <h3 className="font-semibold text-lg mb-2 border-b pb-2 text-gray-700">
          Ringkasan Belanja
        </h3>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-center py-4">Keranjang kosong.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id ?? item.product_id} className="py-2 border-b last:border-0">
              <p className="font-medium text-gray-800">
                {item.name} <span className="text-gray-500">(x{item.qty})</span>
              </p>
              <p className="text-sm text-gray-600">
                Harga: Rp {Number(item.price || 0).toLocaleString("id-ID")} <br />
                Subtotal:{" "}
                <span className="font-semibold text-[#E63946]">
                  Rp {(Number(item.price || 0) * (item.qty || 1)).toLocaleString("id-ID")}
                </span>
              </p>
            </div>
          ))
        )}

        <p className="font-bold mt-4 text-right text-xl text-[#E63946]">
          Total: Rp {Number(total).toLocaleString("id-ID")}
        </p>
      </div>

      {/* FORM PEMBAYARAN */}
      <form
        onSubmit={handleCheckout}
        className="border rounded-2xl p-5 bg-white shadow-md space-y-4"
      >
        <h3 className="font-semibold text-lg border-b pb-2 text-gray-700">
          Metode Pembayaran
        </h3>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-[#118AB2] text-gray-700"
        >
          <option value="QRIS">QRIS (Bayar Sekarang)</option>
          <option value="PayLater">PayLater (Bayar Nanti)</option>
        </select>

        {paymentMethod === "QRIS" && (
          <div className="border p-4 rounded-xl bg-gray-50 text-center mt-4">
            <p className="font-medium mb-2 text-gray-800">
              Scan kode QR di bawah untuk menyelesaikan pembayaran:
            </p>
            <img
              src="/assets/qr-code.png"
              alt="QRIS Code"
              className="mx-auto w-48 h-48 object-contain border rounded-lg mb-3"
            />
            <p className="text-sm text-gray-600">
              Pastikan nominal sesuai dengan total pembelian.
            </p>
          </div>
        )}

        {paymentMethod === "PayLater" && (
          <div className="border p-4 rounded-xl bg-yellow-50 text-center mt-4">
            <p className="font-medium text-gray-800 mb-2">Kode Tagihan PayLater Kamu:</p>
            <p className="font-bold text-2xl text-[#E63946] tracking-wide">
              PL-{Math.floor(Math.random() * 1000000)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Bayar tagihanmu sebelum <b>7 hari</b> setelah transaksi ini.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#06D6A0] hover:bg-[#118AB2] text-white w-full py-3 rounded-xl font-semibold mt-4 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Konfirmasi Pembelian"}
        </button>
      </form>
    </div>
  );
}
