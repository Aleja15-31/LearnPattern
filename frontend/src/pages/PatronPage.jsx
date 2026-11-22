import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ZAxis,
} from "recharts";
import { BookOpen, Moon, Smartphone, Dumbbell, Check, ArrowRight } from "lucide-react";

const CLUSTER_COLORS = ["#c4b5fd", "#6ee7b7", "#93c5fd", "#f9a8d4"];

export default function PatronPage({ analysis, habits, onNavigate }) {
  const detalle = analysis?.detalleAnalisis;
  const cluster = detalle?.cluster;

  if (!cluster) {
    return (
      <div className="card">
        Registra primero tus hábitos para ver tu patrón de aprendizaje.
      </div>
    );
  }

  const groupAvgs = cluster.averages || {};
  const mapPoints = cluster.map_points || [];
  const totalClusters = cluster.total_clusters || 4;

  const groupedPoints = Array.from({ length: totalClusters }, (_, cid) =>
    mapPoints.filter((p) => p.cluster_id === cid)
  );
  const userPointData = cluster.user_point ? [cluster.user_point] : [];

  const comparisons = [
    {
      label: "Horas de estudio",
      user: Number(habits?.horasEstudioDia ?? groupAvgs.study_hours_per_day ?? 0),
      group: Number(groupAvgs.study_hours_per_day ?? 0),
      max: 12,
      unit: "h",
    },
    {
      label: "Horas de sueño",
      user: Number(habits?.horasSueno ?? groupAvgs.sleep_hours ?? 0),
      group: Number(groupAvgs.sleep_hours ?? 0),
      max: 12,
      unit: "h",
    },
    {
      label: "Redes sociales",
      user: Number(habits?.horasRedesSociales ?? groupAvgs.social_media_hours ?? 0),
      group: Number(groupAvgs.social_media_hours ?? 0),
      max: 10,
      unit: "h",
    },
    {
      label: "Asistencia a clases",
      user: Number(habits?.porcentajeAsistencia ?? groupAvgs.attendance_percentage ?? 0),
      group: Number(groupAvgs.attendance_percentage ?? 0),
      max: 100,
      unit: "%",
    },
    {
      label: "Ejercicio semanal",
      user: Number(habits?.frecuenciaEjercicio ?? groupAvgs.exercise_frequency ?? 0),
      group: Number(groupAvgs.exercise_frequency ?? 0),
      max: 7,
      unit: "veces/sem",
    },
  ];

  function pct(val, max) {
    return Math.min(100, Math.max(0, (val / max) * 100));
  }

  return (
    <>
      <div>
        <div className="page-eyebrow">MI PERFIL DE HÁBITOS</div>
        <h1 className="page-title">Tu patrón de aprendizaje</h1>
        <p className="page-subtitle">
          Descubre a qué grupo de hábitos de K-Means te pareces más (agrupado sin usar la
          nota).
        </p>
      </div>

      {/* Banner morado + Mapa 2D real de K-Means */}
      <section className="hero-banner" style={{ alignItems: "stretch" }}>
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span className="hero-badge">Tu patrón de aprendizaje</span>
          <h2 style={{ fontSize: "2rem" }}>{cluster.label}</h2>
          <p>
            Según tus datos, tus hábitos diarios se parecen más a los estudiantes de este
            grupo en el conjunto de datos analizado.
          </p>

          <div className="stat-pills">
            <div className="stat-pill">
              <div className="stat-pill-label">Grupos identificados</div>
              <div className="stat-pill-value">{totalClusters}</div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-label">Estudiantes en tu grupo</div>
              <div className="stat-pill-value">{cluster.count}</div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-label">Nota promedio grupo</div>
              <div className="stat-pill-value">
                {cluster.avg_exam_score} ({cluster.avg_exam_score_scale_5}/5)
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: "1 1 320px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 14,
            minHeight: 230,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              marginBottom: 6,
              opacity: 0.9,
            }}
          >
            <strong>Mapa de grupos (K-Means + PCA 2D)</strong>
            <span>Punto dorado = Tú</span>
          </div>
          <div style={{ width: "100%", height: 185 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <XAxis type="number" dataKey="x" hide domain={["auto", "auto"]} />
                <YAxis type="number" dataKey="y" hide domain={["auto", "auto"]} />
                <ZAxis range={[28, 28]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(v) => Number(v).toFixed(2)}
                />
                {groupedPoints.map((points, idx) => (
                  <Scatter
                    key={idx}
                    name={`Grupo ${idx + 1}`}
                    data={points}
                    fill={CLUSTER_COLORS[idx % CLUSTER_COLORS.length]}
                    fillOpacity={0.75}
                  />
                ))}
                <Scatter
                  name="Tú"
                  data={userPointData}
                  fill="#facc15"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Caracteristicas del grupo */}
      <section className="card">
        <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>Características del grupo</h3>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 16 }}>
          Los hábitos promedio de los estudiantes del {cluster.label}
        </p>

        <div className="grid-4">
          <div className="card" style={{ boxShadow: "none", padding: 16 }}>
            <BookOpen size={18} color="var(--primary)" />
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>Estudio</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800 }}>
              {groupAvgs.study_hours_per_day} h
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Tú: {habits?.horasEstudioDia ?? "-"} h
            </div>
          </div>

          <div className="card" style={{ boxShadow: "none", padding: 16 }}>
            <Moon size={18} color="#7c3aed" />
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>Sueño</div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800 }}>{groupAvgs.sleep_hours} h</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Tú: {habits?.horasSueno ?? "-"} h
            </div>
          </div>

          <div className="card" style={{ boxShadow: "none", padding: 16 }}>
            <Smartphone size={18} color="#ea580c" />
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
              Redes sociales
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800 }}>
              {groupAvgs.social_media_hours} h
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Tú: {habits?.horasRedesSociales ?? "-"} h
            </div>
          </div>

          <div className="card" style={{ boxShadow: "none", padding: 16 }}>
            <Dumbbell size={18} color="#ca8a04" />
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
              Ejercicio
            </div>
            <div style={{ fontSize: "1.45rem", fontWeight: 800 }}>
              {groupAvgs.exercise_frequency} veces/sem
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Tú: {habits?.frecuenciaEjercicio ?? "-"} veces/sem
            </div>
          </div>
        </div>
      </section>

      {/* Comparativa visual barra a barra */}
      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div>
            <h3 style={{ fontSize: "1rem" }}>¿Cómo se comparan tus hábitos?</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Tu posición frente al promedio de tu grupo
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: "0.78rem", color: "var(--muted)" }}>
            <span>
              <strong style={{ color: "var(--primary)" }}>●</strong> Tú
            </span>
            <span>
              <strong style={{ color: "#94a3b8" }}>|</strong> Promedio del grupo
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {comparisons.map((item) => {
            const diff = +(item.user - item.group).toFixed(1);
            return (
              <div
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "170px 1fr 190px",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <strong style={{ fontSize: "0.88rem" }}>{item.label}</strong>

                <div
                  style={{
                    position: "relative",
                    height: 10,
                    background: "#eceef7",
                    borderRadius: 999,
                  }}
                >
                  {/* Marca promedio grupo */}
                  <div
                    title={`Promedio grupo: ${item.group} ${item.unit}`}
                    style={{
                      position: "absolute",
                      left: `${pct(item.group, item.max)}%`,
                      top: -4,
                      width: 3,
                      height: 18,
                      background: "#64748b",
                      borderRadius: 2,
                    }}
                  />
                  {/* Punto del usuario */}
                  <div
                    title={`Tú: ${item.user} ${item.unit}`}
                    style={{
                      position: "absolute",
                      left: `calc(${pct(item.user, item.max)}% - 7px)`,
                      top: -2,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      border: "2px solid #fff",
                      boxShadow: "0 2px 6px rgba(91, 77, 246, 0.45)",
                    }}
                  />
                </div>

                <div style={{ textAlign: "right", fontSize: "0.8rem" }}>
                  <div>
                    Tú <strong>{item.user}</strong> · Grupo <strong>{item.group}</strong>{" "}
                    {item.unit}
                  </div>
                  <div
                    style={{
                      color: diff === 0 ? "var(--muted)" : diff > 0 ? "var(--success)" : "#ea580c",
                      fontWeight: 600,
                    }}
                  >
                    {diff === 0
                      ? "Igual que el grupo"
                      : `${diff > 0 ? "+" : ""}${diff} ${item.unit} ${
                          diff > 0 ? "sobre" : "bajo"
                        } el grupo`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Explicacion del resultado */}
      <section className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: "0.98rem", marginBottom: 6 }}>¿Qué significa este resultado?</h3>
          <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginBottom: 10, maxWidth: 660 }}>
            El grupo reúne estudiantes con hábitos parecidos a los tuyos. Esto no significa
            que aprendan igual ni que obtengan la misma calificación.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.83rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Check size={15} color="var(--primary)" /> Los grupos se forman solo con la similitud de
              hábitos, sin usar la calificación.
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Check size={15} color="var(--primary)" /> Sirve para ubicar tus hábitos frente a los de
              otros estudiantes, no para juzgarlos.
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate("recomendaciones")}
        >
          Ver recomendaciones <ArrowRight size={16} />
        </button>
      </section>
    </>
  );
}