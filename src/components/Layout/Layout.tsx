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
  LogOut,
  Package,
  CalendarCheck
} from "lucide-react";

import api from "../../service/api";
import "./layout.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        setUserData(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const displayName = userData?.user?.name || "Carregando...";
  const displayRole = userData?.user?.role || "Usuário";
  const displayOrg = userData?.organization?.name || "Fazenda...";

  return (
    <div className={`gdm-layout-wrapper ${isSidebarOpen ? 'mobile-open' : ''}`}>
      <div className="gdm-overlay" onClick={toggleSidebar}></div>

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
          <NavLink to="/agenda" className={({ isActive }) => isActive ? 'gdm-link active' : 'gdm-link'}>
              <CalendarCheck size={18} />
              <span>Agenda de Hoje</span>
          </NavLink>
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

          <div className="gdm-nav-label">Administrativo</div>
          <NavLink to="/agro-settings" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <Package size={18} /> <span>Cadastros Gerais</span>
          </NavLink>

          <div className="gdm-nav-label">Configurações</div>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "gdm-link active" : "gdm-link"}>
            <Settings size={18} /> <span>Ajustes da Conta</span>
          </NavLink>
        </nav>

        <div className="gdm-sidebar-footer">
          <div className="gdm-status">
            <div className="gdm-dot"></div>
            <span>Sistema Online</span>
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
              <span style={{ fontWeight: 700, color: '#10b981' }}>
                {displayOrg}
              </span>
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
                <span className="gdm-user-name">{displayName}</span>
                <span className="gdm-user-role">{displayRole}</span>
              </div>
              <UserCircle size={32} className="gdm-user-icon" />
              <button className="gdm-logout" title="Sair do sistema" onClick={handleLogout}>
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