// src/pages/Cart.jsx
import { Link } from "react-router-dom";
import { useCart } from "../../utils/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Keranjang Anda</h2>

      {cart.length === 0 ? (
        <p>Keranjang kosong.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {item.name} (x{item.qty})
              </span>
              <div className="flex gap-3 items-center">
                <span>Rp {item.price.toLocaleString("id-ID")}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          <p className="mt-4 font-bold text-lg">
            Total: Rp {total.toLocaleString("id-ID")}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/checkout"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Lanjut ke Pembayaran
            </Link>
            <button
              onClick={clearCart}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Kosongkan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
