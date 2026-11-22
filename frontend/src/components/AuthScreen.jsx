import { useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import { api, setToken } from "../services/api";

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
    setNombre("");
    setCorreo("");
    setContrasena("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "register"
          ? await api.register({ nombre, correo, contrasena })
          : await api.login({ correo, contrasena });
      setToken(data.token);
      onAuthSuccess(data.usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="brand" style={{ padding: 0, justifyContent: "center" }}>
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <span className="brand-name" style={{ fontSize: "1.35rem" }}>
            LearnPattern
          </span>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "0.9rem",
            marginTop: 8,
          }}
        >
          Analiza tus hábitos de estudio y descubre patrones con Inteligencia Artificial
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Crear cuenta
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {mode === "register" && (
            <div className="field">
              <label htmlFor="lp-nombre">Nombre completo</label>
              <input
                id="lp-nombre"
                name="lp_nombre"
                type="text"
                placeholder="Paula Pulido"
                autoComplete="off"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="lp-correo">Correo electrónico</label>
            <input
              id="lp-correo"
              name="lp_correo"
              type="email"
              placeholder="estudiante@gmail.com"
              autoComplete="off"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="lp-contrasena">Contraseña</label>
            <input
              id="lp-contrasena"
              name="lp_contrasena"
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              minLength={6}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: 6 }}
          >
            {loading
              ? "Procesando..."
              : mode === "register"
              ? "Crear cuenta y entrar"
              : "Iniciar sesión"}
          </button>
        </form>

        <p
          style={{
            marginTop: 18,
            fontSize: "0.76rem",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          Prueba de concepto PTIA · Las estimaciones son orientativas y se basan en
          patrones de datos simulados.
        </p>
      </div>
    </div>
  );
}