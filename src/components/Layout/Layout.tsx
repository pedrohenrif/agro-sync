// ARQUIVO: src/components/Layout/Layout.tsx

import React, { useState, useEffect, ReactNode } from "react";
import "./layout.css";
import { NavLink, useLocation } from "react-router-dom";
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

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`layout-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>

      <div className="sidebar-overlay" onClick={toggleSidebar}></div>

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
             <span role="img" aria-label="seedling">🌱</span> AgroSync
          </div>
          <button className="sidebar-close-button" onClick={toggleSidebar} aria-label="Fechar menu">
             <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <LayoutDashboard size={18} /> <span>Visão Geral</span> </NavLink>
          <NavLink to="/gerenciar-horta" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <PlusSquare size={18} /> <span>Adicionar Canteiro</span> </NavLink>
          <NavLink to="/hortas" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <List size={18} /> <span>Meus Canteiros</span> </NavLink>
          <NavLink to="/supply-stock" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <Archive size={18} /> <span>Estoque</span> </NavLink>
          <NavLink to="/ask-ai" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> <BrainCircuit size={18} /> <span>Consultar IA</span> </NavLink>
        </nav>

        <div className="sidebar-footer">
        </div>
      </aside>

      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <button className="hamburger-button" onClick={toggleSidebar} aria-label="Abrir menu">
               <Menu size={24} />
            </button>
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="search"
                placeholder="Buscar canteiro, insumo..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="header-right">
             <div className="header-icon" title="Tempo (Exemplo)"><CloudSun size={20} /></div>
             <div className="header-icon" title="Notificações"><Bell size={20} /></div>
             <div className="user-info">
                <UserCircle size={24} />
                <span>Nome Usuário</span> 
             </div>
          </div>
        </header>

        <main className="page-content">
          {children} 
        </main>
      </div>
    </div>
  );
};

export default Layout;