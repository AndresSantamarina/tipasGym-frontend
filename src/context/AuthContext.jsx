import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = () => {
      const tokenStorage = localStorage.getItem("token");
      const adminStorage = localStorage.getItem("admin");

      if (tokenStorage && adminStorage) {
        setToken(tokenStorage);
        setAdmin(JSON.parse(adminStorage));
      } else {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
      }

      setLoading(false);
    };

    verificarSesion();
  }, []);

  const login = (userData, userToken) => {
    setAdmin(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("admin", JSON.stringify(userData));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
