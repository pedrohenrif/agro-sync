// ARQUIVO: src/pages/Dashboard/Dashboard.tsx

import React from 'react';
import DashboardStats from './DashboardStats'; 

import './dashboard.css'; 

const Dashboard = () => {
  return (
    <div className="dashboard-container"> 
      <DashboardStats /> 
    </div>
  );
};

export default Dashboard;