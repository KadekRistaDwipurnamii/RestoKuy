import { Link } from "react-router-dom";
/* Export Komponen dengan nama Navbar */
export default function navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="font-bold text-xl">
        MyShop
      </Link>

      {/* Menu Navigasi */}
      <div className="flex gap-6">
        {/* Dashboard Links */}
        <Link to="/dashboard" className="hover:text-gray-200">
          Dashboard
        </Link>
        <Link to="/cart" className="hover:text-gray-200">
          Keranjang
        </Link>
        <Link to="/checkout" className="hover:text-gray-200">
          Checkout
        </Link>
      </div>
    </nav>
  );
}