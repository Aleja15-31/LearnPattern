const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8080";

const TOKEN_KEY = "learnpattern_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend en Java este encendido."
    );
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      setToken(null);
    }
    if (data.errores && typeof data.errores === "object") {
      const detalle = Object.values(data.errores).join(" ");
      throw new Error(`${data.mensaje || "Datos invalidos."} ${detalle}`);
    }
    throw new Error(data.mensaje || "Ocurrio un error al procesar la solicitud.");
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMe: () => request("/api/auth/me"),

  evaluarHabitos: (payload) =>
    request("/api/analisis/evaluar", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  simularCambios: (habitosActuales, cambios) =>
    request("/api/analisis/simular", {
      method: "POST",
      body: JSON.stringify({ habitosActuales, cambios }),
    }),

  getMisAnalisis: () => request("/api/analisis/mios"),

  getModeloInfo: () => request("/api/analisis/modelo-info"),
};