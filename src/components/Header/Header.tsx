import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <h2>AgroSync</h2>
      <nav>
        <ul>
          <li><a href="#">Início</a></li>
          <li><a href="#">Sobre</a></li>
          <li><a href="#">Contato</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
