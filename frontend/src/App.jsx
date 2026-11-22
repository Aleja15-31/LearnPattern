import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { api, getToken, setToken } from "./services/api";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import InicioPage from "./pages/InicioPage";
import RegistrarSesionPage from "./pages/RegistrarSesionPage";
import ResultadoPage from "./pages/ResultadoPage";
import AnalisisPage from "./pages/AnalisisPage";
import PatronPage from "./pages/PatronPage";
import RecomendacionesPage from "./pages/RecomendacionesPage";

const TAB_TITLES = {
  inicio: "Inicio",
  registrar: "Registrar sesión",
  resultado: "Resultado de sesión",
  analisis: "Análisis y simulador",
  patron: "Mi patrón de aprendizaje (K-Means)",
  recomendaciones: "Recomendaciones",
};

function toHabitsPayload(registro) {
  if (!registro) return null;
  return {
    usuarioId: registro.usuarioId,
    edad: Number(registro.edad),
    genero: registro.genero,
    horasEstudioDia: Number(registro.horasEstudioDia),
    horasRedesSociales: Number(registro.horasRedesSociales),
    horasNetflix: Number(registro.horasNetflix),
    trabajoMedioTiempo: Boolean(registro.trabajoMedioTiempo),
    porcentajeAsistencia: Number(registro.porcentajeAsistencia),
    horasSueno: Number(registro.horasSueno),
    calidadAlimentacion: registro.calidadAlimentacion,
    frecuenciaEjercicio: Number(registro.frecuenciaEjercicio),
    nivelEducacionPadres: registro.nivelEducacionPadres,
    calidadInternet: registro.calidadInternet,
    valoracionSaludMental: Number(registro.valoracionSaludMental),
    participaExtracurriculares: Boolean(registro.participaExtracurriculares),
  };
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("inicio");

  const [historial, setHistorial] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentHabits, setCurrentHabits] = useState(null);

  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState("");

  async function loadHabitsForAnalysis(analysisItem) {
    if (!analysisItem?.registroHabitosId) {
      setCurrentHabits(null);
      return;
    }
    try {
      const registro = await api.getRegistroHabito(analysisItem.registroHabitosId);
      setCurrentHabits(toHabitsPayload(registro));
    } catch {
      setCurrentHabits(null);
    }
  }

  async function loadUserHistory() {
    try {
      const sesiones = await api.getMisAnalisis();
      const lista = sesiones || [];
      setHistorial(lista);
      if (lista.length > 0) {
        setCurrentAnalysis(lista[0]);
        await loadHabitsForAnalysis(lista[0]);
      } else {
        setCurrentAnalysis(null);
        setCurrentHabits(null);
      }
    } catch {
      setHistorial([]);
    }
  }

  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) {
        setCheckingAuth(false);
        return;
      }
      try {
        const me = await api.getMe();
        setUsuario(me);
        await loadUserHistory();
      } catch {
        setToken(null);
        setUsuario(null);
      } finally {
        setCheckingAuth(false);
      }
    }
    restoreSession();
  }, []);

  async function handleAuthSuccess(userData) {
    setUsuario(userData);
    setActiveTab("inicio");
    await loadUserHistory();
  }

  function handleLogout() {
    setToken(null);
    setUsuario(null);
    setHistorial([]);
    setCurrentAnalysis(null);
    setCurrentHabits(null);
    setActiveTab("inicio");
  }

  function navigateTo(tab) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleEvaluateHabits(payload) {
    setEvalError("");
    setEvalLoading(true);
    try {
      const resultado = await api.evaluarHabitos(payload);
      setCurrentHabits(payload);
      setCurrentAnalysis(resultado);
      setHistorial((prev) => [resultado, ...prev]);
      navigateTo("resultado");
    } catch (err) {
      setEvalError(err.message);
    } finally {
      setEvalLoading(false);
    }
  }

  async function handleSelectSession(sessionItem) {
    setCurrentAnalysis(sessionItem);
    await loadHabitsForAnalysis(sessionItem);
    navigateTo("resultado");
  }

  if (checkingAuth) {
    return (
      <div className="auth-wrapper">
        <div className="card">Cargando LearnPattern...</div>
      </div>
    );
  }

  if (!usuario) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const initialLetter = usuario.nombre?.charAt(0)?.toUpperCase() || "E";

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={navigateTo}
        hasAnalysis={Boolean(currentAnalysis)}
      />

      <div className="main-area">
        <header className="topbar">
          <span className="topbar-title">{TAB_TITLES[activeTab]}</span>
          <div className="topbar-user">
            <div className="user-pill">
              <div className="user-avatar">{initialLetter}</div>
              <span>{usuario.nombre}</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </header>

        <main className="content-container">
          {activeTab === "inicio" && (
            <InicioPage
              usuario={usuario}
              hasAnalysis={Boolean(currentAnalysis)}
              historial={historial}
              onNavigate={navigateTo}
              onSelectSession={handleSelectSession}
            />
          )}

          {activeTab === "registrar" && (
            <RegistrarSesionPage
              usuario={usuario}
              initialValues={currentHabits}
              loading={evalLoading}
              error={evalError}
              onSubmit={handleEvaluateHabits}
              onCancel={() => navigateTo("inicio")}
            />
          )}

          {activeTab === "resultado" && (
            <ResultadoPage
              analysis={currentAnalysis}
              habits={currentHabits}
              onNavigate={navigateTo}
            />
          )}

          {activeTab === "analisis" && (
            <AnalisisPage
              analysis={currentAnalysis}
              habits={currentHabits}
              onNavigate={navigateTo}
            />
          )}

          {activeTab === "patron" && (
            <PatronPage
              analysis={currentAnalysis}
              habits={currentHabits}
              onNavigate={navigateTo}
            />
          )}

          {activeTab === "recomendaciones" && (
            <RecomendacionesPage
              analysis={currentAnalysis}
              onNavigate={navigateTo}
            />
          )}
        </main>
      </div>
    </div>
  );
}