import { Lightbulb, Star, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";

const PRIORITY_BADGE = {
  alta: { label: "Prioridad alta", className: "badge-danger" },
  media: { label: "Prioridad media", className: "badge-warning" },
  baja: { label: "Hábito equilibrado", className: "badge-success" },
};

export default function RecomendacionesPage({ analysis, onNavigate }) {
  const detalle = analysis?.detalleAnalisis;
  const recommendations = detalle?.recommendations || [];

  if (recommendations.length === 0) {
    return (
      <div className="card">
        Registra primero una sesión para generar tus recomendaciones personalizadas.
      </div>
    );
  }

  const topRec = recommendations.find((r) => r.is_top_opportunity) || recommendations[0];
  const otherRecs = recommendations.filter((r) => r.habit_key !== topRec.habit_key);

  return (
    <>
      <div>
        <div className="page-eyebrow">RECOMENDACIONES PARA TUS HÁBITOS</div>
        <h1 className="page-title">Sugerencias para tus hábitos</h1>
        <p className="page-subtitle">
          Revisa algunas sugerencias orientativas basadas en tus hábitos registrados y en
          tu perfil.
        </p>
      </div>

      {/* Banner superior morado */}
      <section className="hero-banner" style={{ padding: "20px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.2)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Lightbulb size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.2rem", marginBottom: 2 }}>
              Basadas en tus datos y en tu {detalle.cluster?.label}
            </h2>
            <p style={{ fontSize: "0.86rem" }}>
              Revisamos {recommendations.length} hábitos clave y los comparamos con los de
              estudiantes con patrones parecidos a los tuyos.
            </p>
          </div>
        </div>
        <span className="hero-badge" style={{ marginBottom: 0 }}>
          {recommendations.length} hábitos revisados
        </span>
      </section>

      {/* Tarjeta principal: mayor posibilidad de mejora */}
      <section className="card" style={{ borderColor: "#d8d4fe", background: "#fcfcff" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--primary)",
              letterSpacing: "0.05em",
            }}
          >
            {topRec.category}
          </span>
          <span className="badge badge-warning">
            <Star size={13} /> MAYOR POSIBILIDAD DE MEJORA
          </span>
        </div>

        <div className="grid-2" style={{ alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 4 }}>
              HÁBITO OBSERVADO · {topRec.title.toUpperCase()}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 10 }}>
              {topRec.user_value}{" "}
              <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--muted)" }}>
                {topRec.unit}
              </span>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#344054", marginBottom: 16 }}>
              <strong>Sugerencia:</strong> {topRec.suggestion}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate("analisis")}
            >
              Probar en el simulador <ArrowRight size={16} />
            </button>
          </div>

          <div className="card" style={{ boxShadow: "none", background: "#fff" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted)", marginBottom: 10 }}>
              TÚ FRENTE A TU GRUPO ({detalle.cluster?.label})
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
              <span>Tú</span>
              <strong>
                {topRec.user_value} {topRec.unit}
              </strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    (topRec.user_value / Math.max(topRec.user_value, topRec.group_average, 1)) *
                      100
                  )}%`,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.88rem",
                marginTop: 12,
              }}
            >
              <span>Promedio del grupo</span>
              <strong>
                {topRec.group_average} {topRec.unit}
              </strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  background: "#cbd5e1",
                  width: `${Math.min(
                    100,
                    (topRec.group_average / Math.max(topRec.user_value, topRec.group_average, 1)) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resto de habitos revisados */}
      <section className="grid-2">
        {otherRecs.map((rec) => {
          const badgeInfo = PRIORITY_BADGE[rec.priority] || PRIORITY_BADGE.media;
          return (
            <div className="card" key={rec.habit_key} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                    {rec.category}
                  </span>
                  <span className={`badge ${badgeInfo.className}`}>{badgeInfo.label}</span>
                </div>

                <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{rec.title}</div>
                <div style={{ fontSize: "1.55rem", fontWeight: 800, margin: "2px 0" }}>
                  {rec.user_value}{" "}
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)" }}>
                    {rec.unit}
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, marginBottom: 10 }}>
                  Promedio del grupo: {rec.group_average} {rec.unit}
                </div>

                <p style={{ fontSize: "0.87rem", color: "#475467" }}>{rec.suggestion}</p>
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: "7px 12px", fontSize: "0.82rem" }}
                  onClick={() => onNavigate("analisis")}
                >
                  Probar en el simulador <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Aviso importante */}
      <div className="alert alert-warning">
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>IMPORTANTE:</strong> {detalle.disclaimer}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onNavigate("analisis")}
        >
          <ArrowLeft size={16} /> Volver al análisis
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate("patron")}
        >
          Ver mi patrón <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}