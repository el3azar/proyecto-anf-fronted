// src/services/auth/authService.js
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const authService = {
  login: async (username, password) => {
    const resp = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    // intenta parsear JSON aún en error para usar mensaje del backend si existe
    const text = await resp.text().catch(() => null);
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = text; }

    if (!resp.ok) {
      const msg = parsed && parsed.message ? parsed.message : (typeof parsed === "string" ? parsed : "Credenciales incorrectas");
      throw new Error(msg);
    }

    // éxito: devuelve JSON ya parseado
    return parsed;
  }
};
