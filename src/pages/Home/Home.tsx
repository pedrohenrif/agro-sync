import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

const Home: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="home-container">
      <Header />
      <main className="home-body">
        <h1>Bem-vindo ao AgroSync</h1>
        <p>Gerencie sua horta de forma inteligente e eficiente!</p>
        
        <div 
          className="horta-box" 
          onMouseEnter={() => setShowInfo(true)} 
          onMouseLeave={() => setShowInfo(false)}
        >
          <span className="horta-placeholder">Horta</span>
          {showInfo && (
            <div className="horta-info">
              <p><strong>Histórico:</strong> Cultivo saudável nos últimos meses</p>
              <p><strong>Data de plantio:</strong> 10/02/2025</p>
              <p><strong>Data prevista de colheita:</strong> 15/04/2025</p>
              <p><strong>Cultura:</strong> Alface</p>
              <p><strong>Dicas de cuidados:</strong> Regar diariamente e evitar exposição excessiva ao sol</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
