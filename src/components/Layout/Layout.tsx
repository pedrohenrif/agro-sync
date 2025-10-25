// ARQUIVO: src/components/Layout/Layout.tsx

import { ReactNode } from "react";
import "./layout.css"; // Importa o CSS refatorado
// Importa NavLink para estilizar link ativo e ícones
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, // Ícone para Visão Geral
  PlusSquare,    // Ícone para Adicionar Canteiro
  List,          // Ícone para Meus Canteiros
  Archive,       // Ícone para Estoque
  BrainCircuit,  // Ícone para Consultar IA
  UserCircle,    // Ícone de Usuário
  Bell,          // Ícone de Notificações
  CloudSun       // Ícone de Tempo (exemplo)
} from "lucide-react";

type LayoutProps = {
  children: ReactNode; // O conteúdo da página atual
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout-container"> {/* Renomeado para evitar conflito com 'layout' genérico */}
      
      {/* Barra Lateral */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Logo */}
          <div className="logo">
             <span role="img" aria-label="seedling">🌱</span> AgroSync
          </div>
        </div>

        {/* Navegação Principal */}
        <nav className="sidebar-nav">
          {/* Usando NavLink para links */}
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <LayoutDashboard size={18} /> 
            <span>Visão Geral</span>
          </NavLink>
          <NavLink 
            to="/gerenciar-horta" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <PlusSquare size={18} />
            <span>Adicionar Canteiro</span>
          </NavLink>
          <NavLink 
            to="/hortas" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <List size={18} />
            <span>Meus Canteiros</span>
          </NavLink>
          <NavLink 
            to="/supply-stock" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <Archive size={18} />
            <span>Estoque</span>
          </NavLink>
          <NavLink 
            to="/ask-ai" /* Adicionado link da IA que faltava */
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <BrainCircuit size={18} />
            <span>Consultar IA</span>
          </NavLink>
          {/* Adicione outros links aqui */}
        </nav>
        
        {/* Espaço extra no final (opcional) */}
        <div className="sidebar-footer">
           {/* Pode colocar um link de 'Configurações' ou 'Sair' aqui */}
        </div>
      </aside>

      {/* Conteúdo Principal (Direita) */}
      <div className="main-content">
        {/* Cabeçalho Superior */}
        <header className="main-header">
           {/* Espaço à esquerda (ex: para busca global) */}
           <div className="header-left">
              {/* <input type="search" placeholder="Buscar..." /> */}
           </div>
           {/* Informações à direita */}
           <div className="header-right">
             <div className="header-icon">
                <CloudSun size={20} /> 
                {/* Aqui viria a lógica para mostrar o tempo */}
             </div>
             <div className="header-icon">
                <Bell size={20} />
                {/* Lógica de notificações */}
             </div>
             <div className="user-info">
                <UserCircle size={24} />
                <span>Nome Usuário</span> {/* Substituir pelo nome real */}
                {/* Dropdown de usuário aqui */}
             </div>
           </div>
        </header>

        {/* Área de Conteúdo da Página Atual */}
        <main className="page-content">
          {children} {/* Renderiza o componente da rota atual (ex: <Dashboard />) */}
        </main>
      </div>
    </div>
  );
};

export default Layout;