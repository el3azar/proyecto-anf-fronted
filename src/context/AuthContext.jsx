// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth/authService";

const TOKEN_KEY = "analisis_token";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) setIsAuthenticated(true);
  }, []);

  const login = async (userName, contrasena) => {
    const data = await authService.login(userName, contrasena);
    sessionStorage.setItem(TOKEN_KEY, data.token);
    setUser({ userName: data.userName, rol: data.rol });
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
