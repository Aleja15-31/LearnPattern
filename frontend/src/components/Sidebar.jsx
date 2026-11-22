import {
  Sparkles,
  Home,
  ClipboardEdit,
  BarChart3,
  TrendingUp,
  Network,
  Lightbulb,
} from "lucide-react";

const MENU_ITEMS = [
  { id: "inicio", label: "Inicio", icon: Home, requiresResult: false },
  { id: "registrar", label: "Registrar sesión", icon: ClipboardEdit, requiresResult: false },
  { id: "resultado", label: "Resultado de sesión", icon: BarChart3, requiresResult: true },
  { id: "analisis", label: "Análisis", icon: TrendingUp, requiresResult: true },
  { id: "patron", label: "Mi patrón de aprendizaje", icon: Network, requiresResult: true },
  { id: "recomendaciones", label: "Recomendaciones", icon: Lightbulb, requiresResult: true },
];

export default function Sidebar({ activeTab, onSelectTab, hasAnalysis }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <span className="brand-name">LearnPattern</span>
        </div>

        <div className="nav-section-label">MENÚ</div>
        <nav className="nav-list">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const disabled = item.requiresResult && !hasAnalysis;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                disabled={disabled}
                onClick={() => onSelectTab(item.id)}
                title={disabled ? "Registra primero tus hábitos para ver esta pestaña" : ""}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-note">
        <strong>Recuerda</strong>
        Las estimaciones son orientativas y se basan en patrones de datos simulados. No
        garantizan una calificación específica.
      </div>
    </aside>
  );
}