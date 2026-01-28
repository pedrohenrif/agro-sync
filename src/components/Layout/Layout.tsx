import React, { useState, useEffect, ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Archive,
  BrainCircuit,
  Calendar,
  ClipboardCheck,
  ListChecks,
  UserCircle,
  Bell,
  CloudSun,
  Menu,
  X,
  Settings,
  Building2,
  LogOut
} from "lucide-react";

import "./layout.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Dados para exibição (Simulados por enquanto)
  const user = {
    name: "Pedro Henrique",
    role: "Administrador",
    organization: "Fazenda AgroSync"
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`gdm-layout-wrapper ${isSidebarOpen ? 'mobile-open' : ''}`}>
      {/* Overlay para Mobile */}
      <div className="gdm-overlay" onClick={toggleSidebar}></div>

      {/* --- SIDEBAR --- */}
      <aside className="gdm-sidebar">
        <div className="gdm-sidebar-header">
          <div className="gdm-logo" onClick={() => navigate('/dashboard')}>
            <span className="gdm-logo-emoji">🌱</span>
            <span className="gdm-logo-text">AgroSync</span>
          </div>
          <button className="gdm-close-sidebar" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="gdm-nav">
          <div className="gdm-nav-label">Principal</div>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <LayoutDashboard size={18} /> <span>Painel Geral</span>
          </NavLink>

          <div className="gdm-nav-label">Produção</div>
          <NavLink to="/gardens" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <List size={18} /> <span>Canteiros</span>
          </NavLink>
          <NavLink to="/supply-stock" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <Archive size={18} /> <span>Estoque</span>
          </NavLink>
          <NavLink to="/crop-plans" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <ClipboardCheck size={18} /> <span>Planos de Cultivo</span>
          </NavLink>

          <div className="gdm-nav-label">Gestão</div>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <ListChecks size={18} /> <span>Tarefas</span>
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <Calendar size={18} /> <span>Calendário</span>
          </NavLink>
          <NavLink to="/ask-ai" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <BrainCircuit size={18} /> <span>Consultar IA</span>
          </NavLink>
        </nav>

        <div className="gdm-sidebar-footer">
          <div className="gdm-status">
            <div className="gdm-dot"></div>
            <span>Sistema Operacional</span>
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="gdm-main-container">
        <header className="gdm-header">
          <div className="gdm-header-left">
            <button className="gdm-menu-trigger" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="gdm-org-tag">
              <Building2 size={16} />
              <span>{user.organization}</span>
            </div>
          </div>

          <div className="gdm-header-right">
            <div className="gdm-actions">
              <button className="gdm-icon-btn"><CloudSun size={20} /></button>
              <button className="gdm-icon-btn">
                <Bell size={20} />
                <span className="gdm-badge"></span>
              </button>
              <button className="gdm-icon-btn" onClick={() => navigate('/settings')}>
                <Settings size={20} />
              </button>
            </div>

            <div className="gdm-user-box">
              <div className="gdm-user-info">
                <span className="gdm-user-name">{user.name}</span>
                <span className="gdm-user-role">{user.role}</span>
              </div>
              <UserCircle size={32} className="gdm-user-icon" />
              <button className="gdm-logout" onClick={() => navigate('/login')}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="gdm-page-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;