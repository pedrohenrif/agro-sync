import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Login from "./components/Login/Login";
import RecuperarSenha from "./components/RecuperarSenha/RecuperarSenha";
import Layout from "./components/Layout/Layout";

import Home from "./pages/Home/Home";
import AskAI from "./pages/AskAI/AskAI";
import GerenciarHorta from "./pages/GerenciarHorta/ManageGarden";
import HortasCadastradas from "./pages/HortasCadastradas/RegisteredGardens";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/gerenciar-horta" element={<GerenciarHorta />} />
          <Route path="/hortas" element={<HortasCadastradas />} />
        </Routes>
      </Layout>
    </Router>
  );
}


export default App;
