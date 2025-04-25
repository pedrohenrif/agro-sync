// components/Layout.tsx
import { ReactNode } from "react";
import "./layout.css";
import { Link } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">🌱 AgroSync</div>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/ask-ai">Perguntar à IA</Link>
          <Link to="/gerenciar-horta">Gerenciar Horta</Link>
          <Link to="/hortas">Hortas Cadastradas</Link>
          <Link to="/visualizar-canteiros">Visualizar Canteiros</Link>
          <Link to="/dashboard">Visão Geral</Link>
        </nav>
      </aside>
      <div className="main-content">
        <header className="header">
          <div className="user-info">👤 Usuário | 🌤️ Tempo | 🔔 Notificações</div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
