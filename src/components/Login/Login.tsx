import React, { useState, useEffect } from "react";
import "./Login.css"; 
// Importando nossa instância centralizada do Axios
import api from '../../service/api'; 
// Use 'useNavigate' para redirecionar após o login, se desejar
// import { useNavigate } from "react-router-dom"; 

// --- Dados para o Slider ---
const sliderData = [
  {
    icon: "📖",
    title: "Diário de Campo Detalhado",
    description: "Registre todas as atividades, desde o plantio até a colheita, com nosso diário de campo inteligente."
  },
  {
    icon: "📦",
    title: "Gerenciamento de Insumos",
    description: "Controle seu estoque de sementes, fertilizantes e ferramentas com precisão."
  },
  {
    icon: "🤖",
    title: "Insights com I.A.",
    description: "Nossa inteligência artificial analisa seus dados para fornecer dicas e previsões personalizadas."
  },
  {
    icon: "📊",
    title: "Relatórios de Plantação",
    description: "Gere relatórios completos sobre o rendimento, custos e saúde da sua horta."
  },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // const navigate = useNavigate(); // Descomente se estiver usando React Router

  // --- Lógica do Slider ---
  useEffect(() => {
    // Timer para trocar o slide automaticamente a cada 5 segundos
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 segundos

    // Limpa o timer quando o componente é desmontado
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // --- Lógica de Submit (Refatorada) ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setIsLoading(true);
    setError(""); // Limpa erros antigos

    try {
      // Usando nossa instância 'api'
      // ATENÇÃO: Corrigi o endpoint. Seu 'api.ts' tem baseURL '/api'.
      // Seu backend escuta em '/api/login'. Portanto, só precisamos chamar '/login'.
      const response = await api.post("/login", { email, senha });

      // O Axios já nos dá 'data.success'
      if (!response.data.success) {
        setError(response.data.message || "Erro ao fazer login");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", response.data.data.token);
      alert("Login realizado com sucesso!");
      setIsLoading(false);
      // Aqui você pode redirecionar o usuário:
      // navigate('/dashboard'); 

    } catch (err: any) {
      // Erros do Axios ficam em 'err.response.data'
      const apiError = err.response?.data?.message || "Erro ao conectar com o servidor";
      setError(apiError);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* ======================================================= */}
      {/* LADO ESQUERDO: FORMULÁRIO (1/3 da tela) */}
      {/* ======================================================= */}
      <div className="login-form-section">
        <div className="login-form-content">
          <h2 className="login-title">AgroSync 🌿</h2>
          <p className="login-subtitle">Bem-vindo de volta! Acesse sua conta.</p>

          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={isLoading}
            />

            <p className="forgot-password">
              <a href="#">Esqueceu sua senha?</a>
            </p>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="signup-link">
            Não tem uma conta? <a href="#">Cadastre-se</a>
          </p>
        </div>
      </div>

      {/* ======================================================= */}
      {/* LADO DIREITO: SLIDER (2/3 da tela) */}
      {/* ======================================================= */}
      <div className="login-slider-section">
        <div className="slider-content">
          {sliderData.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-icon">{slide.icon}</div>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-description">{slide.description}</p>
            </div>
          ))}
        </div>
        
        <div className="slider-nav">
          {sliderData.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;