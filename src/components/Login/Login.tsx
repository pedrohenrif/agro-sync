import React from "react";
import "./Login.css"; // Importação do CSS

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">AgroSync - Login</h2>
        <form className="login-form">
          <label>Email</label>
          <input type="email" placeholder="Digite seu email" />

          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" />

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
        <p className="forgot-password">
          Esqueceu sua senha? <a href="#">Recuperar</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
