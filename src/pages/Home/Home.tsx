import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Header />
      <main className="home-body">
        <h1>Bem-vindo ao AgroSync</h1>
        <p>Gerencie sua horta de forma inteligente e eficiente!</p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
