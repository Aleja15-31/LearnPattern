
import { useEffect, useState } from "react";
import {
  User,
  Clock,
  Heart,
  ArrowRight,
  AlertCircle,
  Info,
} from "lucide-react";

const INITIAL_FORM = {
  edad: 20,
  genero: "Female",
  trabajoMedioTiempo: false,
  horasEstudioDia: 4.5,
  horasRedesSociales: 2.5,
  horasNetflix: 1.5,
  horasSueno: 7.0,
  porcentajeAsistencia: 88,
  frecuenciaEjercicio: 3,
  calidadAlimentacion: "Good",
  calidadInternet: "Good",
  nivelEducacionPadres: "Bachelor",
  participaExtracurriculares: true,
  valoracionSaludMental: 7,
};

export default function RegistrarSesionPage({
  usuario,
  initialValues,
  loading,
  error,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialValues || INITIAL_FORM);

  // Actualiza el formulario cuando llegan datos desde el backend.
  useEffect(() => {
    if (initialValues) {
      setForm({
        ...INITIAL_FORM,
        ...initialValues,
      });
    }
  }, [initialValues]);

  // Actualiza un campo específico del formulario.
  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Prepara los datos y los envía al componente principal.
  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      usuarioId: usuario.id,
      edad: Number(form.edad),
      genero: form.genero,
      horasEstudioDia: Number(form.horasEstudioDia),
      horasRedesSociales: Number(form.horasRedesSociales),
      horasNetflix: Number(form.horasNetflix),
      trabajoMedioTiempo: Boolean(form.trabajoMedioTiempo),
      porcentajeAsistencia: Number(form.porcentajeAsistencia),
      horasSueno: Number(form.horasSueno),
      calidadAlimentacion: form.calidadAlimentacion,
      frecuenciaEjercicio: Number(form.frecuenciaEjercicio),
      nivelEducacionPadres: form.nivelEducacionPadres,
      calidadInternet: form.calidadInternet,
      valoracionSaludMental: Number(form.valoracionSaludMental),
      participaExtracurriculares: Boolean(
        form.participaExtracurriculares
      ),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div>
        <div className="page-eyebrow">REGISTRAR SESIÓN</div>
        <h1 className="page-title">Cuéntanos sobre tus hábitos</h1>
        <p className="page-subtitle">
          Ingresa tus hábitos y características para estimar tu rendimiento
          académico.
        </p>
      </div>

      <div className="card">
        <div className="stepper">
          <div className="step-item">
            <div className="step-num">1</div>
            <div>
              <div className="step-title">Información personal</div>
              <div className="step-desc">Datos básicos</div>
            </div>
          </div>

          <div className="step-item">
            <div className="step-num">2</div>
            <div>
              <div className="step-title">Hábitos diarios</div>
              <div className="step-desc">Estudio, sueño y más</div>
            </div>
          </div>

          <div className="step-item">
            <div className="step-num">3</div>
            <div>
              <div className="step-title">Bienestar y entorno</div>
              <div className="step-desc">Contexto del estudiante</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle
            size={18}
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <span>{error}</span>
        </div>
      )}

      {initialValues && (
        <div className="alert alert-info">
          <Info
            size={18}
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <span>
            Se cargaron los hábitos que registraste en tu última sesión.
            Puedes modificar cualquier dato y generar una nueva estimación.
          </span>
        </div>
      )}

      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="step-num" style={{ borderRadius: 10 }}>
              <User size={16} />
            </div>

            <div>
              <h3 style={{ fontSize: "1rem" }}>Información personal</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                Cuéntanos quién eres
              </p>
            </div>
          </div>

          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            1 / 3
          </span>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="edad">Edad (años)</label>
            <input
              id="edad"
              type="number"
              min={10}
              max={100}
              value={form.edad}
              onChange={(e) => updateField("edad", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="genero">Género</label>
            <select
              id="genero"
              value={form.genero}
              onChange={(e) => updateField("genero", e.target.value)}
            >
              <option value="Female">Femenino</option>
              <option value="Male">Masculino</option>
              <option value="Other">Otro</option>
            </select>
          </div>

          <div className="field">
            <label>¿Tienes trabajo de medio tiempo?</label>
            <div className="radio-row">
              <button
                type="button"
                className={`radio-chip ${
                  form.trabajoMedioTiempo ? "selected" : ""
                }`}
                onClick={() => updateField("trabajoMedioTiempo", true)}
              >
                Sí
              </button>

              <button
                type="button"
                className={`radio-chip ${
                  !form.trabajoMedioTiempo ? "selected" : ""
                }`}
                onClick={() => updateField("trabajoMedioTiempo", false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="step-num"
              style={{
                borderRadius: 10,
                background: "var(--success-soft)",
                color: "var(--success)",
              }}
            >
              <Clock size={16} />
            </div>

            <div>
              <h3 style={{ fontSize: "1rem" }}>Hábitos diarios</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                Tu rutina en un día típico
              </p>
            </div>
          </div>

          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            2 / 3
          </span>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="horasEstudioDia">
              Horas de estudio al día (0 - 24)
            </label>
            <input
              id="horasEstudioDia"
              type="number"
              step="0.1"
              min={0}
              max={24}
              value={form.horasEstudioDia}
              onChange={(e) =>
                updateField("horasEstudioDia", e.target.value)
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="horasRedesSociales">
              Horas en redes sociales al día (0 - 24)
            </label>
            <input
              id="horasRedesSociales"
              type="number"
              step="0.1"
              min={0}
              max={24}
              value={form.horasRedesSociales}
              onChange={(e) =>
                updateField("horasRedesSociales", e.target.value)
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="horasNetflix">
              Horas en Netflix / series al día (0 - 24)
            </label>
            <input
              id="horasNetflix"
              type="number"
              step="0.1"
              min={0}
              max={24}
              value={form.horasNetflix}
              onChange={(e) =>
                updateField("horasNetflix", e.target.value)
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="horasSueno">
              Horas de sueño al día (0 - 24)
            </label>
            <input
              id="horasSueno"
              type="number"
              step="0.1"
              min={0}
              max={24}
              value={form.horasSueno}
              onChange={(e) => updateField("horasSueno", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="porcentajeAsistencia">
              Porcentaje de asistencia a clases (0 - 100%)
            </label>
            <input
              id="porcentajeAsistencia"
              type="number"
              step="0.5"
              min={0}
              max={100}
              value={form.porcentajeAsistencia}
              onChange={(e) =>
                updateField("porcentajeAsistencia", e.target.value)
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="frecuenciaEjercicio">
              Frecuencia de ejercicio (veces por semana)
            </label>
            <select
              id="frecuenciaEjercicio"
              value={form.frecuenciaEjercicio}
              onChange={(e) =>
                updateField("frecuenciaEjercicio", Number(e.target.value))
              }
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n === 0
                    ? "0 veces (ninguna)"
                    : `${n} ${n === 1 ? "vez" : "veces"} por semana`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="step-num"
              style={{
                borderRadius: 10,
                background: "#fce7f3",
                color: "#db2777",
              }}
            >
              <Heart size={16} />
            </div>

            <div>
              <h3 style={{ fontSize: "1rem" }}>Bienestar y entorno</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                Factores del contexto y salud
              </p>
            </div>
          </div>

          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
            3 / 3
          </span>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="calidadAlimentacion">
              Calidad de alimentación
            </label>
            <select
              id="calidadAlimentacion"
              value={form.calidadAlimentacion}
              onChange={(e) =>
                updateField("calidadAlimentacion", e.target.value)
              }
            >
              <option value="Poor">Baja (Poor)</option>
              <option value="Fair">Regular (Fair)</option>
              <option value="Good">Buena (Good)</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="calidadInternet">Calidad de internet</label>
            <select
              id="calidadInternet"
              value={form.calidadInternet}
              onChange={(e) =>
                updateField("calidadInternet", e.target.value)
              }
            >
              <option value="Poor">Baja (Poor)</option>
              <option value="Average">Media (Average)</option>
              <option value="Good">Buena (Good)</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="nivelEducacionPadres">
              Nivel educativo de los padres
            </label>
            <select
              id="nivelEducacionPadres"
              value={form.nivelEducacionPadres}
              onChange={(e) =>
                updateField("nivelEducacionPadres", e.target.value)
              }
            >
              <option value="None">Ninguno (None)</option>
              <option value="High School">Bachillerato (High School)</option>
              <option value="Bachelor">Pregrado (Bachelor)</option>
              <option value="Master">Maestría / Posgrado (Master)</option>
            </select>
          </div>

          <div className="field">
            <label>Participación en actividades extracurriculares</label>
            <div className="radio-row">
              <button
                type="button"
                className={`radio-chip ${
                  form.participaExtracurriculares ? "selected" : ""
                }`}
                onClick={() =>
                  updateField("participaExtracurriculares", true)
                }
              >
                Sí
              </button>

              <button
                type="button"
                className={`radio-chip ${
                  !form.participaExtracurriculares ? "selected" : ""
                }`}
                onClick={() =>
                  updateField("participaExtracurriculares", false)
                }
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div className="field" style={{ marginTop: 18 }}>
          <label>
            Valoración de salud mental (1 = muy baja, 10 = muy alta)
          </label>

          <div className="scale-row">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                type="button"
                className={`scale-btn ${
                  Number(form.valoracionSaludMental) === val
                    ? "selected"
                    : ""
                }`}
                onClick={() => updateField("valoracionSaludMental", val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--muted)",
            maxWidth: 520,
          }}
        >
          La estimación es orientativa y se basa en patrones de datos
          simulados. No garantiza una calificación específica.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Analizando con IA..." : "Estimar calificación"}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </form>
  );
}
