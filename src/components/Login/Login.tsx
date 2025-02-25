import React, { useState } from "react";
import "./Login.css"; // Importação do CSS

const Login = () => {
  // Estados para armazenar email, senha e mensagens de erro
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  // Função para enviar o login para o backend
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evita recarregar a página
    
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Erro ao fazer login");
        return;
      }

      // Armazena o token no localStorage e redireciona
      localStorage.setItem("token", data.data.token);
      alert("Login realizado com sucesso!");
      // Aqui você pode redirecionar o usuário, por exemplo:
      // window.location.href = "/dashboard";

    } catch (err) {
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">AgroSync - Login</h2>

        {error && <p className="error-message">{error}</p>} {/* Exibe erro se houver */}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

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
