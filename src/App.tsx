import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import React from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./components/Layout/Layout"; // Seu componente de Layout

// Importe suas páginas
import Home from "./pages/Home/Home";
import Register from './pages/Auth/Register';
import AskAI from "./pages/AskAI/AskAI";
import GardenManager from "./pages/Gardens/GardenManager";
import Dashboard from "./pages/Dashboard";
import SupplyStock from "./pages/SupplyStock/SupplyStock";
import Login from "./pages/Auth/Login";
import TaskManager from "./pages/TaskManager/TaskManager";
import SeasonalCalendar from "./pages/SeasonalCalendar/SeasonalCalendar";
import CropPlans from "./pages/CropPlans/CropPlans";
import SearchResults from "./pages/SearchResults/SearchResults";
import Settings from './pages/Settings/Settings';
import AgroSettings from './pages/AgroSettings/AgroSettings';
import TaskAgenda from './pages/TaskAgenda/TaskAgenda';
import Finance from './pages/Finance/Finance';
import FarmMap from './pages/Map/FarmMap';


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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/gardens" element={<GardenManager />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/supply-stock" element={<SupplyStock />} />
          <Route path="/crop-plans" element={<CropPlans />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/calendar" element={<SeasonalCalendar />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/agro-settings" element={<AgroSettings />} />
          <Route path="/agenda" element={<TaskAgenda />} />
          <Route path="/financeiro" element={<Finance />} />
          <Route path="/mapa" element={<FarmMap />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;