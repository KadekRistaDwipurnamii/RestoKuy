import axios from "axios";

// ✅ Ambil token dari localStorage kalau ada
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// ✅ Gunakan token fallback kalau belum login (optional)
const FALLBACK_TOKEN =
  "1|3CS0OTsZ4UB7UtbGQaFeuumrAvlo6o3oDHCiWMUm7c9ddf19";
// ✅ Buat instance axios
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// ✅ Interceptor supaya token selalu ikut
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken() || FALLBACK_TOKEN;

    // kalau belum ada Authorization, tambahkan
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // otomatis ubah Content-Type sesuai isi body
    if (config.data instanceof FormData) {
      // biar boundary form-data otomatis
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
