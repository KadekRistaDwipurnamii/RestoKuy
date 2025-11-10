import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 🧠 Ambil data user dari localStorage (biar gak logout pas refresh)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("member");
    return saved ? JSON.parse(saved) : null;
  });

  // 🗂️ Simpan user ke localStorage setiap kali berubah
  useEffect(() => {
    if (user) {
      localStorage.setItem("member", JSON.stringify(user));
    } else {
      localStorage.removeItem("member");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
