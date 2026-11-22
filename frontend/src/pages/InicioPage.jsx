import {
  ArrowRight,
  ClipboardEdit,
  BarChart3,
  Network,
  Lightbulb,
  History,
} from "lucide-react";

export default function InicioPage({
  usuario,
  hasAnalysis,
  historial,
  onNavigate,
  onSelectSession,
}) {
  const primerNombre = usuario?.nombre?.split(" ")[0] || "Estudiante";

  return (
    <>
      <div>
        <h1 className="page-title">¡Hola, {primerNombre}! Bienvenido a LearnPattern</h1>
        <p className="page-subtitle">
          Conoce tus hábitos y su relación con tu rendimiento académico estimado.
        </p>
      </div>

      <section className="hero-banner">
        <div>
          <span className="hero-badge">Empieza aquí</span>
          <h2>Conoce tus hábitos</h2>
          <p>
            Registra tus hábitos de estudio, sueño y actividad para obtener una estimación
            de tu calificación, identificar tu grupo K-Means y explorar simulaciones.
          </p>
          <button
            type="button"
            className="btn btn-white"
            style={{ marginTop: 18 }}
            onClick={() => onNavigate("registrar")}
          >
            Registrar mis hábitos <ArrowRight size={17} />
          </button>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.14)",
            borderRadius: 18,
            padding: "20px 24px",
            minWidth: 210,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "0.75rem", opacity: 0.9, marginBottom: 4 }}>
            SESIONES REGISTRADAS
          </div>
          <div style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1.1 }}>
            {historial.length}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.85, marginTop: 4 }}>
            guardadas en tu perfil
          </div>
        </div>
      </section>

      <section className="card">
        <div className="stepper">
          {[
            { num: 1, title: "Registra", desc: "tus hábitos" },
            { num: 2, title: "Resultado", desc: "nota estimada" },
            { num: 3, title: "Patrón", desc: "grupos similares" },
            { num: 4, title: "Recomendaciones", desc: "simula cambios" },
          ].map((step) => (
            <div className="step-item" key={step.num}>
              <div className="step-num">{step.num}</div>
              <div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <div className="page-eyebrow" style={{ marginBottom: 12 }}>
          EXPLORA LEARNPATTERN
        </div>
        <div className="grid-2">
          <div className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div className="step-num" style={{ width: 42, height: 42, borderRadius: 12 }}>
              <ClipboardEdit size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>Registrar hábitos</h3>
              <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginBottom: 10 }}>
                Ingresa tus datos de estudio, sueño y otros hábitos diarios.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onNavigate("registrar")}
              >
                Comenzar <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div
              className="step-num"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "var(--success-soft)",
                color: "var(--success)",
              }}
            >
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>Mi resultado</h3>
              <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginBottom: 10 }}>
                Consulta tu calificación estimada y la comparación entre modelos.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                disabled={!hasAnalysis}
                onClick={() => onNavigate("resultado")}
              >
                Ver resultado <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div className="step-num" style={{ width: 42, height: 42, borderRadius: 12 }}>
              <Network size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>Mi patrón</h3>
              <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginBottom: 10 }}>
                Explora tu grupo K-Means y compárate con hábitos similares.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                disabled={!hasAnalysis}
                onClick={() => onNavigate("patron")}
              >
                Explorar <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div
              className="step-num"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "var(--warning-soft)",
                color: "var(--warning)",
              }}
            >
              <Lightbulb size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>Recomendaciones</h3>
              <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginBottom: 10 }}>
                Consulta sugerencias orientativas para ajustar tus hábitos.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                disabled={!hasAnalysis}
                onClick={() => onNavigate("recomendaciones")}
              >
                Consultar <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {historial.length > 0 && (
        <section className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <History size={18} color="var(--primary)" />
            <h3 style={{ fontSize: "1rem" }}>Tus sesiones guardadas en PostgreSQL</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {historial.slice(0, 5).map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "var(--bg)",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <strong>
                    {item.notaExamenEstimada} / 100
                    {item.notaEscala5 ? ` (${item.notaEscala5} / 5.0)` : ""}
                  </strong>
                  <span style={{ marginLeft: 10, color: "var(--muted)", fontSize: "0.85rem" }}>
                    {item.patronAprendizaje} · Modelo: {item.nombreModelo}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                  onClick={() => onSelectSession(item)}
                >
                  Abrir análisis
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}