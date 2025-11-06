import React, { createContext, useContext, useState } from "react";

const TOKEN_KEY = "analisis_token";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Inicializamos el estado de autenticación leyendo de sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);

  // LOGIN SIMULADO: Esta función será reemplazada por la llamada real al backend
  const login = async (userName, password) => {
    console.log(`Simulando login para el usuario: ${userName}`);
    // Simulación: Creamos un token y usuario falsos
    const fakeToken = 'fake-jwt-token-for-dev';
    const fakeUser = { userName: userName, rol: 'ANALISTA' }; // Rol único

    // Guardamos en sessionStorage para persistir la sesión
    sessionStorage.setItem(TOKEN_KEY, fakeToken);
    
    // Actualizamos el estado de la aplicación
    setUser(fakeUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Limpiamos el estado y el sessionStorage
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem(TOKEN_KEY);
  };
  
  const contextValue = { isAuthenticated, user, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);