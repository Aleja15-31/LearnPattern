import {
  CheckCircle2,
  Info,
  BookOpen,
  Moon,
  Smartphone,
  CalendarCheck,
  Dumbbell,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

const MODEL_LABELS = {
  linear_regression: "Regresión lineal",
  neural_network: "Red neuronal densa",
};

export default function ResultadoPage({ analysis, habits, onNavigate }) {
  const detalle = analysis?.detalleAnalisis;
  if (!detalle) {
    return (
      <div className="card">
        No hay datos de análisis cargados. Registra primero tus hábitos.
      </div>
    );
  }

  const linear = detalle.model_comparison?.linear_regression;
  const neural = detalle.model_comparison?.neural_network;
  const baseline = detalle.model_comparison?.baseline;
  const diff = Number(detalle.difference_vs_reference || 0);

  return (
    <>
      <div>
        <div className="page-eyebrow">RESULTADO DE SESIÓN</div>
        <h1 className="page-title">El resultado de tu sesión</h1>
        <p className="page-subtitle">
          Aquí puedes consultar la estimación de tu rendimiento académico según los hábitos
          ingresados.
        </p>
      </div>

      {/* Banner principal morado */}
      <section className="hero-banner">
        <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
          <div className="score-ring">
            <span className="score-ring-value">{detalle.estimated_score}</span>
            <span className="score-ring-sub">de 100</span>
            <span
              style={{
                marginTop: 4,
                fontSize: "0.75rem",
                fontWeight: 700,
                background: "rgba(255,255,255,0.22)",
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              {detalle.estimated_score_scale_5} / 5.0
            </span>
          </div>

          <div>
            <span className="hero-badge">Tu calificación estimada</span>
            <h2>{detalle.performance_level}</h2>
            <p>
              Según los hábitos que registraste, el modelo seleccionado (
              <strong>{MODEL_LABELS[detalle.best_model] || detalle.best_model}</strong>) estima
              esta calificación en el examen final. Es una estimación orientativa, no una
              garantía de tu nota real.
            </p>

            <div className="stat-pills">
              <div className="stat-pill">
                <div className="stat-pill-label">Promedio de referencia</div>
                <div className="stat-pill-value">
                  {detalle.reference_average} ({detalle.reference_average_scale_5}/5)
                </div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-label">Diferencia</div>
                <div className="stat-pill-value">
                  {diff >= 0 ? `+${diff}` : diff} pts
                </div>
              </div>
              <div className="stat-pill">
                <div className="stat-pill-label">Grupo de hábitos</div>
                <div className="stat-pill-value">{detalle.cluster?.label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparacion de modelos */}
      <section className="card">
        <h3 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Comparación de modelos</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 16 }}>
          Estimación de cada modelo supervisado con tus hábitos y métricas reales en el
          conjunto de prueba
        </p>

        <div className="grid-2">
          {/* Tarjeta Regresion Lineal */}
          <div
            className="card"
            style={{
              boxShadow: "none",
              borderColor: linear?.is_selected ? "var(--primary)" : "var(--border)",
              background: linear?.is_selected ? "#fafaff" : "var(--surface)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h4 style={{ fontSize: "0.98rem" }}>Regresión lineal</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  Relación estadística lineal entre hábitos y nota
                </p>
              </div>
              {linear?.is_selected && (
                <span className="badge badge-primary">
                  <CheckCircle2 size={13} /> MODELO UTILIZADO
                </span>
              )}
            </div>

            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "1.9rem", fontWeight: 800 }}>
                {linear?.predicted_score}
              </span>
              <span style={{ color: "var(--muted)", fontWeight: 600 }}>/ 100</span>
              <span className="badge badge-primary" style={{ marginLeft: "auto" }}>
                {linear?.predicted_score_scale_5} / 5.0
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, linear?.predicted_score || 0)}%` }}
              />
            </div>

            <div className="grid-3" style={{ marginTop: 12 }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>MAE</div>
                <strong>{linear?.mae}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>RMSE</div>
                <strong>{linear?.rmse}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>R²</div>
                <strong>{linear?.r2}</strong>
              </div>
            </div>
          </div>

          {/* Tarjeta Red Neuronal Densa */}
          <div
            className="card"
            style={{
              boxShadow: "none",
              borderColor: neural?.is_selected ? "var(--primary)" : "var(--border)",
              background: neural?.is_selected ? "#fafaff" : "var(--surface)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h4 style={{ fontSize: "0.98rem" }}>Red neuronal densa</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  Capas ocultas (64, 32) con activación ReLU y salida lineal
                </p>
              </div>
              {neural?.is_selected && (
                <span className="badge badge-primary">
                  <CheckCircle2 size={13} /> MODELO UTILIZADO
                </span>
              )}
            </div>

            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: "1.9rem", fontWeight: 800 }}>
                {neural?.predicted_score}
              </span>
              <span style={{ color: "var(--muted)", fontWeight: 600 }}>/ 100</span>
              <span className="badge badge-primary" style={{ marginLeft: "auto" }}>
                {neural?.predicted_score_scale_5} / 5.0
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, neural?.predicted_score || 0)}%` }}
              />
            </div>

            <div className="grid-3" style={{ marginTop: 12 }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>MAE</div>
                <strong>{neural?.mae}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>RMSE</div>
                <strong>{neural?.rmse}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>R²</div>
                <strong>{neural?.r2}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: 16 }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Se selecciona automáticamente el modelo con menor error en los datos de prueba.
            Como referencia, predecir siempre el promedio (baseline) obtiene MAE:{" "}
            <strong>{baseline?.mae}</strong> y RMSE: <strong>{baseline?.rmse}</strong>.
          </span>
        </div>
      </section>

      {/* Resumen de habitos */}
      {habits && (
        <section className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <h3 style={{ fontSize: "1rem" }}>Resumen de tus hábitos</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                Los datos que ingresaste en esta sesión
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "7px 12px", fontSize: "0.84rem" }}
              onClick={() => onNavigate("analisis")}
            >
              Ver análisis completo <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid-5">
            <div className="card" style={{ boxShadow: "none", padding: 14 }}>
              <BookOpen size={18} color="var(--primary)" />
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 6 }}>
                Horas de estudio
              </div>
              <strong style={{ fontSize: "1.1rem" }}>{habits.horasEstudioDia} h</strong>
            </div>

            <div className="card" style={{ boxShadow: "none", padding: 14 }}>
              <Moon size={18} color="#7c3aed" />
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 6 }}>
                Horas de sueño
              </div>
              <strong style={{ fontSize: "1.1rem" }}>{habits.horasSueno} h</strong>
            </div>

            <div className="card" style={{ boxShadow: "none", padding: 14 }}>
              <Smartphone size={18} color="#ea580c" />
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 6 }}>
                Redes sociales
              </div>
              <strong style={{ fontSize: "1.1rem" }}>{habits.horasRedesSociales} h</strong>
            </div>

            <div className="card" style={{ boxShadow: "none", padding: 14 }}>
              <CalendarCheck size={18} color="var(--success)" />
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 6 }}>
                Asistencia
              </div>
              <strong style={{ fontSize: "1.1rem" }}>{habits.porcentajeAsistencia}%</strong>
            </div>

            <div className="card" style={{ boxShadow: "none", padding: 14 }}>
              <Dumbbell size={18} color="#ca8a04" />
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 6 }}>
                Ejercicio
              </div>
              <strong style={{ fontSize: "1.1rem" }}>
                {habits.frecuenciaEjercicio} veces/sem
              </strong>
            </div>
          </div>
        </section>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onNavigate("registrar")}
        >
          <SlidersHorizontal size={16} /> Modificar mis hábitos
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate("recomendaciones")}
        >
          Ver recomendaciones <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}