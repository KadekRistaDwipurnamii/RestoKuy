import { Link } from "react-router-dom";

// SidebarOpen menerima destructuring props.
// Artinya Sidebar menerima sebuah objek props yang dikirim dari parent component (misalnya dari AdminLayout).
// sidebarOpen sebuah state boolean (true/false) untuk menentukan sidebar sedang terbuka atau tertutup.
export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`${
        sidebarOpen ? "block" : "hidden"
      } md:block w-64 bg-white shadow-md`}
    >
      <div className="p-4 font-bold text-xl">My Admin</div>
      <nav className="flex flex-col p-4 space-y-2">
        {/* Navigasi Link ke halaman dashboard */}
        <Link
          to="/admin/dashboard"
          className="hover:bg-gray-200 p-2 rounded"
        >
          Dashboard
        </Link>
        <Link to="/admin/about" className="hover:bg-gray-200 p-2 rounded">
          About
        </Link>
      </nav>
    </div>
  );
}