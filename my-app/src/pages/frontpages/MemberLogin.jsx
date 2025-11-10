import { useUser } from "../../utils/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function MemberLogin() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/members?email=${email}`);
      const member = res.data.data;

      if (member) {
        setUser(member);
        localStorage.setItem("member", JSON.stringify(member)); // simpan ke localStorage
        toast.success(`Selamat datang, ${member.nama}!`);
        navigate("/checkout");
      } else {
        toast.error("Member tidak ditemukan!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal login, coba lagi!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-[#FFF8F0]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-[#E63946] mb-6">Login Member</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="text-left text-gray-600 font-medium">Email kamu</label>
          <input
            name="email"
            type="email"
            placeholder="contoh: rista@gmail.com"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFD166] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#E63946] text-white font-semibold py-2 rounded-lg hover:bg-[#d62828] transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-6">
          Gunakan email yang sudah terdaftar di sistem RestoKuy.
        </p>
      </div>
    </div>
  );
}
