import React, { useState } from "react";
import "./Home.css";

const Home: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="home-container">
      <main className="home-body">
        <h1>Bem-vindo ao AgroSync</h1>
        <p>Gerencie sua horta de forma inteligente e eficiente!</p>

      </main>
    </div>
  );
};

export default Home;
