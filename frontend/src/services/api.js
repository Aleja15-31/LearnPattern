
const RAW_API_URL = import.meta.env.VITE_API_URL;

const API_BASE_URL =
  RAW_API_URL !== undefined
    ? RAW_API_URL.replace(/\/$/, "")
    : "http://localhost:8080";

const TOKEN_KEY = "learnpattern_token";

/**
 * Obtiene el token de autenticación almacenado.
 * @returns {string|null} Token JWT del usuario.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Guarda o elimina el token de autenticación.
 * @param {string|null} token Token JWT.
 */
export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Realiza solicitudes HTTP al backend.
 * Agrega automáticamente el token JWT cuando existe.
 * @param {string} path Ruta del endpoint.
 * @param {Object} options Opciones de la solicitud.
 * @returns {Promise<Object|null>} Respuesta del servidor.
 */
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

      throw new Error(
        `${data.mensaje || "Datos invalidos."} ${detalle}`
      );
    }

    throw new Error(
      data.mensaje || "Ocurrio un error al procesar la solicitud."
    );
  }

  return data;
}

/**
 * Funciones disponibles para comunicarse con el backend.
 */
export const api = {
  // Registrar un usuario.
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Iniciar sesión.
  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Obtener información del usuario autenticado.
  getMe: () => request("/api/auth/me"),

  // Registrar y evaluar los hábitos del estudiante.
  evaluarHabitos: (payload) =>
    request("/api/analisis/evaluar", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Simular cambios en los hábitos del estudiante.
  simularCambios: (habitosActuales, cambios) =>
    request("/api/analisis/simular", {
      method: "POST",
      body: JSON.stringify({ habitosActuales, cambios }),
    }),

  // Consultar los análisis del usuario autenticado.
  getMisAnalisis: () => request("/api/analisis/mios"),

  // Consultar un registro de hábitos por su identificador.
  getRegistroHabito: (id) =>
    request(`/api/registros-habitos/${id}`),

  // Consultar información y métricas de los modelos de IA.
  getModeloInfo: () => request("/api/analisis/modelo-info"),
};
