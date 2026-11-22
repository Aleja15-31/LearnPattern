import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { SlidersHorizontal, RefreshCw, ArrowRight, Info, AlertCircle } from "lucide-react";
import { api } from "../services/api";

const MODEL_LABELS = {
  linear_regression: "Regresión lineal",
  neural_network: "Red neuronal densa",
};

export default function AnalisisPage({ analysis, habits, onNavigate }) {
  const detalle = analysis?.detalleAnalisis;
  const avgs = detalle?.dataset_averages || {};

  const [simStudy, setSimStudy] = useState(Number(habits?.horasEstudioDia ?? 4.5));
  const [simSleep, setSimSleep] = useState(Number(habits?.horasSueno ?? 7.0));
  const [simSocial, setSimSocial] = useState(Number(habits?.horasRedesSociales ?? 2.5));
  const [simAttendance, setSimAttendance] = useState(
    Number(habits?.porcentajeAsistencia ?? 85)
  );
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState("");

  useEffect(() => {
    if (habits) {
      setSimStudy(Number(habits.horasEstudioDia));
      setSimSleep(Number(habits.horasSueno));
      setSimSocial(Number(habits.horasRedesSociales));
      setSimAttendance(Number(habits.porcentajeAsistencia));
      setSimResult(null);
      setSimError("");
    }
  }, [habits]);

  if (!detalle) {
    return <div className="card">Registra primero una sesión para ver el análisis.</div>;
  }

  const userStudy = Number(habits?.horasEstudioDia ?? avgs.study_hours_per_day ?? 0);
  const userSleep = Number(habits?.horasSueno ?? avgs.sleep_hours ?? 0);
  const userSocial = Number(habits?.horasRedesSociales ?? avgs.social_media_hours ?? 0);
  const userNetflix = Number(habits?.horasNetflix ?? avgs.netflix_hours ?? 0);
  const userAttendance = Number(habits?.porcentajeAsistencia ?? avgs.attendance_percentage ?? 0);

  const chartData = [
    { name: "Estudio", Tu: userStudy, Promedio: avgs.study_hours_per_day || 0 },
    { name: "Sueño", Tu: userSleep, Promedio: avgs.sleep_hours || 0 },
    { name: "Redes", Tu: userSocial, Promedio: avgs.social_media_hours || 0 },
    { name: "Netflix", Tu: userNetflix, Promedio: avgs.netflix_hours || 0 },
  ];

  async function handleSimulate() {
    if (!habits) return;
    setSimError("");
    setSimLoading(true);
    try {
      const response = await api.simularCambios(habits, {
        horasEstudioDia: Number(simStudy),
        horasSueno: Number(simSleep),
        horasRedesSociales: Number(simSocial),
        porcentajeAsistencia: Number(simAttendance),
      });
      setSimResult(response);
    } catch (err) {
      setSimError(err.message);
    } finally {
      setSimLoading(false);
    }
  }

  function formatDelta(val, avg, unit) {
    const diff = +(val - (avg || 0)).toFixed(1);
    return `${diff >= 0 ? "+" : ""}${diff} ${unit} vs promedio`;
  }

  return (
    <>
      <div>
        <div className="page-eyebrow">ANÁLISIS DE MIS HÁBITOS</div>
        <h1 className="page-title">Analiza tus hábitos</h1>
        <p className="page-subtitle">
          Explora tus hábitos frente al promedio del dataset y simula diferentes escenarios.
        </p>
      </div>

      {/* KPIs frente al promedio */}
      <section className="grid-4">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Horas de estudio</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>
            {userStudy} h
          </div>
          <span className="badge badge-primary">
            {formatDelta(userStudy, avgs.study_hours_per_day, "h")}
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Horas de sueño</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>
            {userSleep} h
          </div>
          <span className="badge badge-success">
            {formatDelta(userSleep, avgs.sleep_hours, "h")}
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Redes sociales</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>
            {userSocial} h
          </div>
          <span className="badge badge-warning">
            {formatDelta(userSocial, avgs.social_media_hours, "h")}
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Asistencia</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0" }}>
            {userAttendance}%
          </div>
          <span className="badge badge-success">
            {formatDelta(userAttendance, avgs.attendance_percentage, "pts")}
          </span>
        </div>
      </section>

      {/* Grafica de barras + tarjeta resumen morada */}
      <section className="grid-2" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="card">
          <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>Mis hábitos</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 16 }}>
            Horas por día: tú frente al promedio de los 1.000 registros
          </p>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit="h" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Tu" name="Tú" fill="#5b4df6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Promedio" name="Promedio" fill="#c7d2fe" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="hero-banner"
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{ fontSize: "0.78rem", opacity: 0.85, fontWeight: 700 }}>
            MI CALIFICACIÓN ESTIMADA
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div className="score-ring" style={{ width: 112, height: 112, borderWidth: 6 }}>
              <span style={{ fontSize: "1.65rem", fontWeight: 800 }}>
                {detalle.estimated_score}
              </span>
              <span style={{ fontSize: "0.72rem", opacity: 0.9 }}>de 100</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.86rem" }}>
              <div>
                <div style={{ opacity: 0.75, fontSize: "0.7rem" }}>EQUIVALENCIA</div>
                <strong>{detalle.estimated_score_scale_5} / 5.0</strong>
              </div>
              <div>
                <div style={{ opacity: 0.75, fontSize: "0.7rem" }}>MODELO</div>
                <strong>{MODEL_LABELS[detalle.best_model] || detalle.best_model}</strong>
              </div>
              <div>
                <div style={{ opacity: 0.75, fontSize: "0.7rem" }}>GRUPO DE HÁBITOS</div>
                <strong>{detalle.cluster?.label}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador interactivo */}
      <section className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div className="step-num" style={{ borderRadius: 10 }}>
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.02rem" }}>Explora diferentes escenarios</h3>
            <p style={{ fontSize: "0.83rem", color: "var(--muted)" }}>
              Mueve los controles y compara en vivo cómo cambia la estimación del modelo
            </p>
          </div>
        </div>

        {!habits ? (
          <div className="alert alert-info" style={{ marginTop: 14 }}>
            <Info size={18} />
            <span>
              Registra una nueva sesión para activar el simulador interactivo con tus hábitos
              actuales.
            </span>
          </div>
        ) : (
          <div className="grid-2" style={{ marginTop: 18, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                  <strong>Horas de estudio al día</strong>
                  <span className="badge badge-primary">{simStudy} h</span>
                </div>
                <input
                  type="range"
                  className="slider-control"
                  min={0}
                  max={12}
                  step={0.5}
                  value={simStudy}
                  onChange={(e) => setSimStudy(Number(e.target.value))}
                />
                <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Actual: {userStudy} h
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                  <strong>Horas de sueño al día</strong>
                  <span className="badge badge-primary">{simSleep} h</span>
                </div>
                <input
                  type="range"
                  className="slider-control"
                  min={3}
                  max={12}
                  step={0.5}
                  value={simSleep}
                  onChange={(e) => setSimSleep(Number(e.target.value))}
                />
                <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Actual: {userSleep} h
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                  <strong>Horas en redes sociales</strong>
                  <span className="badge badge-primary">{simSocial} h</span>
                </div>
                <input
                  type="range"
                  className="slider-control"
                  min={0}
                  max={10}
                  step={0.5}
                  value={simSocial}
                  onChange={(e) => setSimSocial(Number(e.target.value))}
                />
                <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Actual: {userSocial} h
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                  <strong>Porcentaje de asistencia</strong>
                  <span className="badge badge-primary">{simAttendance}%</span>
                </div>
                <input
                  type="range"
                  className="slider-control"
                  min={40}
                  max={100}
                  step={1}
                  value={simAttendance}
                  onChange={(e) => setSimAttendance(Number(e.target.value))}
                />
                <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Actual: {userAttendance}%
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                background: "#fafaff",
                borderColor: "#dfe2fb",
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                <span style={{ color: "var(--muted)" }}>Calificación estimada actual</span>
                <strong>
                  {detalle.estimated_score} / 100 ({detalle.estimated_score_scale_5}/5)
                </strong>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>
                  NUEVA ESTIMACIÓN SIMULADA
                </div>
                {simResult ? (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "2.1rem", fontWeight: 800, color: "var(--primary)" }}>
                        {simResult.simulated_score}
                      </span>
                      <span style={{ color: "var(--muted)", fontWeight: 600 }}>
                        / 100 ({simResult.simulated_score_scale_5} / 5.0)
                      </span>
                      <span
                        className={`badge ${
                          simResult.score_difference >= 0 ? "badge-success" : "badge-danger"
                        }`}
                      >
                        {simResult.score_difference >= 0 ? "+" : ""}
                        {simResult.score_difference} pts
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
                      Grupo actual: <strong>{simResult.current_cluster}</strong> → Grupo simulado:{" "}
                      <strong>{simResult.simulated_cluster}</strong>
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginTop: 6 }}>
                    Ajusta los controles a la izquierda y presiona el botón para simular con tu
                    modelo de IA.
                  </p>
                )}
              </div>

              {simError && (
                <div className="alert alert-error">
                  <AlertCircle size={16} />
                  <span>{simError}</span>
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSimulate}
                disabled={simLoading}
                style={{ width: "100%" }}
              >
                <RefreshCw size={16} />
                {simLoading ? "Simulando..." : "Comparar nueva estimación"}
              </button>
            </div>
          </div>
        )}

        <div className="alert alert-info" style={{ marginTop: 16 }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Es una simulación del modelo con base en patrones de los datos. No garantiza que
            cambiar un hábito produzca exactamente ese resultado.
          </span>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onNavigate("patron")}
        >
          Ver mi patrón de aprendizaje
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate("recomendaciones")}
        >
          Consultar recomendaciones <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}