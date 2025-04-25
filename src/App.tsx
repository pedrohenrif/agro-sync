import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Layout from "./components/Layout/Layout";

import Home from "./pages/Home/Home";
import AskAI from "./pages/AskAI/AskAI";
import GerenciarHorta from "./pages/GerenciarHorta/ManageGarden";
import HortasCadastradas from "./pages/HortasCadastradas/RegisteredGardens";
import Dashboard from "./pages/Dashboard/Dashboard";


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="/gerenciar-horta" element={<GerenciarHorta />} />
          <Route path="/hortas" element={<HortasCadastradas />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}


export default App;
