import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import React from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./components/Layout/Layout"; // Seu componente de Layout

// Importe suas páginas
import Home from "./pages/Home/Home";
import AskAI from "./pages/AskAI/AskAI";
import GerenciarHorta from "./pages/GerenciarHorta/ManageGarden";
import HortasCadastradas from "./pages/HortasCadastradas/RegisteredGardens";
import Dashboard from "./pages/Dashboard/Dashboard";
import SupplyStock from "./pages/SupplyStock/SupplyStock";
import Login from "./components/Login/Login";


const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/gerenciar-horta" element={<GerenciarHorta />} />
          <Route path="/hortas" element={<HortasCadastradas />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/supply-stock" element={<SupplyStock />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;