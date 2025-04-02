import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import PerimetroSecao from "./components/PerimetroSecao";
import Login from "./components/Login/Login";
import Home from "./pages/Home/Home";
import RecuperarSenha from "./components/RecuperarSenha/RecuperarSenha";
import AskAI from "./pages/AskAI/AskAI";

function App() {
  return (
    //<Login />
    //<RecuperarSenha/>
    
    <Router>
      <Routes>
        <Route path="/ask-ai" element={<AskAI />} />
      </Routes>
    </Router>
  );
}

export default App;
