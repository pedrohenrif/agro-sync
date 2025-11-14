// ARQUIVO: src/components/Layout/Layout.tsx

import React, { useState, useEffect, ReactNode } from "react";
import "./layout.css";
// Importa NavLink, useLocation e useNavigate do react-router-dom
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ListChecks, Calendar } from "lucide-react";
import {
  LayoutDashboard,
  PlusSquare,
  List,
  Archive,
  BrainCircuit,
  UserCircle,
  Bell,
  CloudSun,
  Search,
  Menu,
  X
} from "lucide-react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegação programática

  // Efeito para fechar a sidebar ao mudar de rota
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Atualiza o estado da busca a cada digitação
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Abre/Fecha a sidebar no mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Função chamada ao enviar o formulário de busca (pressionar Enter)
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Previne o recarregamento padrão do form
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length > 1) { // Só busca se tiver ao menos 2 caracteres
      // Navega para a página de resultados, passando a busca como parâmetro 'q' na URL
      navigate(`/search-results?q=${encodeURIComponent(trimmedQuery)}`);
      // Opcional: Limpar o campo de busca após enviar
      // setSearchQuery("");
    }
  };

  return (
    <div className={`layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>

      {/* Overlay para fechar sidebar no mobile */}
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>

      {/* Barra Lateral */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
             <span role="img" aria-label="seedling">🌱</span> AgroSync
          </div>
          <button className="sidebar-close-button" onClick={toggleSidebar} aria-label="Fechar menu">
             <X size={24} />
          </button>
        </div>

        {/* Navegação */}
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <LayoutDashboard size={18} /> <span>Visão Geral</span> </NavLink>
          <NavLink to="/hortas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <List size={18} /> <span>Meus Canteiros</span> </NavLink>
          <NavLink to="/supply-stock" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <Archive size={18} /> <span>Estoque</span> </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <ListChecks size={18} /><span>Tarefas</span></NavLink>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><Calendar size={18} /><span>Calendário Sazonal</span></NavLink>
          <NavLink to="/ask-ai" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <BrainCircuit size={18} /> <span>Consultar IA</span> </NavLink>
        </nav>

        <div className="sidebar-footer"></div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="main-content">
        {/* Cabeçalho */}
        <header className="main-header">
          <div className="header-left">
            {/* Botão Hamburger (Mobile) */}
            <button className="hamburger-button" onClick={toggleSidebar} aria-label="Abrir menu">
               <Menu size={24} />
            </button>

            {/* Formulário de Busca */}
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                  type="search"
                  placeholder="Buscar canteiro..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Buscar"
                />
                {/* Botão de submit escondido para ativar com Enter */}
                 <button type="submit" style={{ display: 'none' }} aria-hidden="true"></button>
              </div>
            </form>
          </div>

          {/* Ícones e Usuário */}
          <div className="header-right">
             <div className="header-icon" title="Tempo (Exemplo)"><CloudSun size={20} /></div>
             <div className="header-icon" title="Notificações"><Bell size={20} /></div>
             <div className="user-info">
                <UserCircle size={24} />
                <span>Nome Usuário</span>
             </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;