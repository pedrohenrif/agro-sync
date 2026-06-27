import React, { useState, useEffect, ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, List, Archive, BrainCircuit, Calendar,
  ClipboardCheck, ListChecks, UserCircle, Bell, CloudSun,
  Menu, X, Settings, Building2, LogOut, Package, CalendarCheck, DollarSign, MapPin
} from "lucide-react";
import api from "../../service/api";

type LayoutProps = { children: ReactNode };

const navLink = (isActive: boolean) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 relative
  ${isActive
    ? "bg-emerald-500/10 text-emerald-400 font-semibold"
    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
  }`;

const NAV = [
  { label: "Principal", links: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Painel Geral" },
  ]},
  { label: "Produção", links: [
    { to: "/agenda",       icon: CalendarCheck, label: "Agenda de Hoje" },
    { to: "/gardens",      icon: List,          label: "Canteiros" },
    { to: "/mapa",         icon: MapPin,         label: "Mapa da Fazenda" },
    { to: "/supply-stock", icon: Archive,        label: "Estoque" },
    { to: "/crop-plans",   icon: ClipboardCheck, label: "Planos de Cultivo" },
  ]},
  { label: "Gestão", links: [
    { to: "/tasks",       icon: ListChecks,   label: "Tarefas" },
    { to: "/calendar",    icon: Calendar,     label: "Calendário" },
    { to: "/financeiro",  icon: DollarSign,   label: "Financeiro" },
    { to: "/ask-ai",      icon: BrainCircuit, label: "Consultar IA" },
  ]},
  { label: "Administrativo", links: [
    { to: "/agro-settings", icon: Package, label: "Cadastros Gerais" },
  ]},
  { label: "Configurações", links: [
    { to: "/settings", icon: Settings, label: "Ajustes da Conta" },
  ]},
];

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me")
      .then(r => setUserData(r.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const displayName = userData?.user?.name || "Carregando...";
  const displayRole = userData?.user?.role || "Usuário";
  const displayOrg  = userData?.organization?.name || "Fazenda...";

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-50">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[190] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static top-0 h-full w-[260px] bg-slate-900 flex flex-col flex-shrink-0
        z-[200] border-r border-white/[0.04] transition-[left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${sidebarOpen ? "left-0" : "-left-[260px] lg:left-0"}
      `}>
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/[0.04] flex-shrink-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">🌱</span>
            <span className="text-white text-[1.2rem] font-extrabold tracking-tight">AgroSync</span>
          </button>
          <button
            className="lg:hidden text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {NAV.map(section => (
            <div key={section.label}>
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.1em] text-white/25 px-3 py-2 mt-4 first:mt-0">
                {section.label}
              </span>
              {section.links.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => navLink(isActive)}>
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-emerald-500 rounded-r" />}
                      <Icon size={18} className={`flex-shrink-0 ${isActive ? "opacity-100" : "opacity-75"}`} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/[0.04] flex-shrink-0">
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <span className="w-[7px] h-[7px] bg-emerald-500 rounded-full animate-pulse-green flex-shrink-0" />
            <span>Sistema Online</span>
          </div>
        </div>
      </aside>

      {/* ── Main container ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-[100]">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-lg transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-semibold text-sm text-slate-700">
              <Building2 size={16} />
              <span className="font-bold text-emerald-600">{displayOrg}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-lg transition-all">
                <CloudSun size={20} />
              </button>
              <button className="relative text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-lg transition-all">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
              </button>
              <button
                className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-lg transition-all"
                onClick={() => navigate("/settings")}
              >
                <Settings size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-slate-900 leading-tight">{displayName}</span>
                <span className="text-xs text-slate-500">{displayRole}</span>
              </div>
              <UserCircle size={32} className="text-slate-400" />
              <button
                onClick={handleLogout}
                title="Sair do sistema"
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 max-sm:p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
