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

function getTierFromScore5(score5) {
  if (score5 > 4.5) return "Rendimiento estimado Superior (4.6 - 5.0)";
  if (score5 >= 4.0) return "Rendimiento estimado Alto (4.0 - 4.5)";
  return "Rendimiento estimado Básico (0.0 - 3.9)";
}

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

  const score100 = Number(detalle.estimated_score || 0);
  const score5 = Number(detalle.estimated_score_scale_5 ?? (score100 / 20).toFixed(2));
  const ref100 = Number(detalle.reference_average || 0);
  const ref5 = Number(detalle.reference_average_scale_5 ?? (ref100 / 20).toFixed(2));
  const diff100 = Number(detalle.difference_vs_reference || 0);
  const diff5 = Number(
    detalle.difference_vs_reference_scale_5 ?? (score5 - ref5).toFixed(2)
  );

  const performanceTitle = getTierFromScore5(score5);
  const diffResumen =
    diff100 > 0
      ? `+${diff100} pts por encima del promedio`
      : diff100 < 0
      ? `${diff100} pts por debajo del promedio`
      : "Igual al promedio general";

  return (
    <>
      <div>
        <div className="page-eyebrow">RESULTADO DE SESIÓN</div>
        <h1 className="page-title">El resultado de tu sesión</h1>
        <p className="page-subtitle">
          Consulta tu nota estimada, cómo se compara frente a los demás estudiantes y qué
          calculó cada modelo de IA.
        </p>
      </div>

      {/* Banner principal morado */}
      <section className="hero-banner">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <div className="score-ring" style={{ width: 154, height: 154 }}>
            <span style={{ fontSize: "0.66rem", textTransform: "uppercase", opacity: 0.88 }}>
              Tu nota estimada
            </span>
            <span className="score-ring-value">{score100}</span>
            <span className="score-ring-sub">de 100 puntos</span>
            <span
              style={{
                marginTop: 4,
                fontSize: "0.78rem",
                fontWeight: 700,
                background: "rgba(255,255,255,0.24)",
                padding: "2px 10px",
                borderRadius: 999,
              }}
            >
              {score5} / 5.0
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <span className="hero-badge">Tu calificación estimada</span>
            <h2>{performanceTitle}</h2>
            <p style={{ maxWidth: 680 }}>
              Según los hábitos que registraste, el modelo principal (
              <strong>{MODEL_LABELS[detalle.best_model] || detalle.best_model}</strong>) estima
              una calificación de <strong>{score100} / 100 ({score5} / 5.0)</strong>. Escala de
              niveles: Básico (0.0 – 3.9) · Alto (4.0 – 4.5) · Superior (4.6 – 5.0).
            </p>

            <div className="stat-pills">
              <div className="stat-pill">
                <div className="stat-pill-label">Nota promedio de los 1.000 estudiantes</div>
                <div className="stat-pill-value">
                  {ref100} / 100 ({ref5} / 5.0)
                </div>
                <div style={{ fontSize: "0.72rem", opacity: 0.85, marginTop: 2 }}>
                  Promedio general de todos los exámenes del dataset
                </div>
              </div>

              <div className="stat-pill">
                <div className="stat-pill-label">Tu nota frente al promedio general</div>
                <div className="stat-pill-value" style={{ fontSize: "0.95rem" }}>
                  {diffResumen}
                </div>
                <div style={{ fontSize: "0.72rem", opacity: 0.85, marginTop: 2 }}>
                  Tu nota ({score100}) menos el promedio ({ref100}) ·{" "}
                  {diff5 >= 0 ? `+${diff5}` : diff5} en escala 0-5
                </div>
              </div>

              <div className="stat-pill">
                <div className="stat-pill-label">Tu grupo de hábitos (K-Means)</div>
                <div className="stat-pill-value">{detalle.cluster?.label}</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.85, marginTop: 2 }}>
                  Estudiantes con rutinas parecidas a la tuya
                </div>
              </div>
            </div>

            {detalle.cluster?.description && (
              <p
                style={{
                  marginTop: 12,
                  fontSize: "0.84rem",
                  background: "rgba(255,255,255,0.16)",
                  padding: "9px 13px",
                  borderRadius: 10,
                  maxWidth: 740,
                }}
              >
                <strong>¿Por qué perteneces al {detalle.cluster.label}?</strong>{" "}
                {detalle.cluster.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Comparacion de modelos */}
      <section className="card">
        <h3 style={{ fontSize: "1.05rem", marginBottom: 4 }}>Comparación de modelos de IA</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 16 }}>
          Ambos modelos supervisados calculan una estimación con tus hábitos y se evalúan en
          200 estudiantes de prueba para medir qué tan precisos son
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <h4 style={{ fontSize: "0.98rem" }}>Regresión lineal</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  Asigna un peso proporcional a cada hábito para estimar la nota
                </p>
              </div>
              {linear?.is_selected && (
                <span className="badge badge-primary">
                  <CheckCircle2 size={13} /> MODELO PRINCIPAL
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
                <div style={{ fontSize: "0.72rem", fontWeight: 700 }}>MAE</div>
                <strong style={{ fontSize: "1.05rem" }}>±{linear?.mae} pts</strong>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Error promedio</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700 }}>RMSE</div>
                <strong style={{ fontSize: "1.05rem" }}>{linear?.rmse} pts</strong>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Castiga fallos grandes</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700 }}>R²</div>
                <strong style={{ fontSize: "1.05rem" }}>
                  {linear?.r2 != null ? `${(linear.r2 * 100).toFixed(1)}%` : "-"}
                </strong>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Notas explicadas</div>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <h4 style={{ fontSize: "0.98rem" }}>Red neuronal densa</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  Capas ocultas ReLU optimizadas con validación cruzada (GridSearchCV)
                </p>
              </div>
              {neural?.is_selected && (
                <span className="badge badge-primary">
                  <CheckCircle2 size={13} /> MODELO PRINCIPAL
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
                <div style={{ fontSize: "0.72rem", fontWeight: 700 }}>MAE</div>
                <strong style={{ fontSize: "1.05rem" }}>±{neural?.mae} pts</strong>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Error promedio</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700 }}>RMSE</div>
                <strong style={{ fontSize: "1.05rem" }}>{neural?.rmse} pts</strong>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Castiga fallos grandes</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700 }}>R²</div>
                <strong style={{ fontSize: "1.05rem" }}>
                  {neural?.r2 != null ? `${(neural.r2 * 100).toFixed(1)}%` : "-"}
                </strong>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Notas explicadas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guia clara para cualquier usuario sobre MAE, RMSE y R2 */}
        <div
          className="alert alert-info"
          style={{ marginTop: 16, flexDirection: "column", gap: 12 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
            <Info size={18} />
            <span>¿Qué significan MAE, RMSE y R² y en qué se diferencian?</span>
          </div>

          <div className="grid-3" style={{ width: "100%" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.75)",
                borderRadius: 10,
                padding: 12,
                color: "var(--text)",
                fontSize: "0.82rem",
              }}
            >
              <strong style={{ color: "var(--primary)", display: "block", marginBottom: 4 }}>
                MAE (Error Absoluto Medio)
              </strong>
              Mide, en promedio, por cuántos puntos sobre 100 se equivoca el modelo frente a
              las notas reales. Por ejemplo, <strong>±{linear?.mae} pts</strong> significa que
              suele acertar con un margen cercano a 4 puntos. <em>Entre más bajo, mejor.</em>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.75)",
                borderRadius: 10,
                padding: 12,
                color: "var(--text)",
                fontSize: "0.82rem",
              }}
            >
              <strong style={{ color: "var(--primary)", display: "block", marginBottom: 4 }}>
                RMSE (Error Cuadrático Medio)
              </strong>
              También mide el error en puntos, pero eleva cada error al cuadrado antes de
              promediarlo; así <strong>castiga más fuerte los fallos grandes</strong>. Por eso
              elegimos como modelo principal al que tiene menor RMSE.
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.75)",
                borderRadius: 10,
                padding: 12,
                color: "var(--text)",
                fontSize: "0.82rem",
              }}
            >
              <strong style={{ color: "var(--primary)", display: "block", marginBottom: 4 }}>
                R² (Nivel de explicación)
              </strong>
              Indica de 0% a 100% qué tanto logra explicar el modelo la relación entre los
              hábitos y la nota final. Un{" "}
              <strong>{linear?.r2 != null ? `${(linear.r2 * 100).toFixed(1)}%` : "89%"}</strong>{" "}
              significa que explica casi el 90% del comportamiento de las calificaciones.
            </div>
          </div>

          <div style={{ fontSize: "0.82rem" }}>
            <strong>¿Por qué sabemos que la IA sí aprende?</strong> Si en vez de IA solo
            adivináramos siempre el promedio general ({ref100}), el error sería MAE{" "}
            <strong>±{baseline?.mae} pts</strong> y RMSE <strong>{baseline?.rmse} pts</strong>.
            Tanto la Regresión Lineal como la Red Neuronal reducen ese error a menos de la mitad.
          </div>
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
              <h3 style={{ fontSize: "1rem" }}>Resumen de tus hábitos registrados</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                Datos reales guardados en tu cuenta para esta sesión
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