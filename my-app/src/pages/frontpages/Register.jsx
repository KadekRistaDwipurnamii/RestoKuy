import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const nama = e.target.nama.value;
    const email = e.target.email.value;
    const telepon = e.target.telepon.value;

    try {
      await axios.post("http://127.0.0.1:8000/api/members", {
        nama,
        email,
        telepon,
      });
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mendaftar, coba lagi!");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input name="nama" placeholder="Nama" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="telepon" placeholder="No HP" required />
      <button type="submit">Daftar</button>
    </form>
  );
}
