import React, { useState, useEffect } from "react";
import "./Login.css"; 
// Importando nossa instância centralizada do Axios
import api from '../../service/api'; 
// Importando o hook para navegação
import { useNavigate } from "react-router-dom"; 

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

  // Hook para navegação
  const navigate = useNavigate(); 

  // --- Lógica de Submit (VERSÃO CORRETA E ÚNICA) ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setIsLoading(true);
    setError(""); // Limpa erros antigos

    try {
      // Usando nossa instância 'api'
      // Seu backend escuta em '/api/login', então chamamos '/login'.
      const response = await api.post("/login", { email, senha });

      // Verifica a resposta da API
      if (!response.data.success) {
        setError(response.data.message || "Erro ao fazer login");
        setIsLoading(false);
        return;
      }

      // Armazena o token e atualiza o estado
      localStorage.setItem("token", response.data.data.token);
      setIsLoading(false);
      
      // Redireciona para a página /home após o sucesso
      navigate('/home'); 

    } catch (err: any) {
      // Captura e exibe erros da API ou de conexão
      const apiError = err.response?.data?.message || "Erro ao conectar com o servidor";
      setError(apiError);
      setIsLoading(false);
    }
  };

  // --- Lógica do Slider (VERSÃO ÚNICA) ---
  useEffect(() => {
    // Timer para trocar o slide automaticamente
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 5000); // Muda a cada 5 segundos
    
    // Limpa o timer quando o componente é desmontado para evitar vazamentos de memória
    return () => clearInterval(timer);
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez (na montagem)

  // Função para navegar para um slide específico clicando nos pontos
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // --- JSX (Renderização do Componente) ---
  return (
    <div className="login-page-container">
      {/* ======================================================= */}
      {/* LADO ESQUERDO: FORMULÁRIO */}
      {/* ======================================================= */}
      <div className="login-form-section">
        <div className="login-form-content">
          <h2 className="login-title">AgroSync 🌿</h2>
          <p className="login-subtitle">Bem-vindo de volta! Acesse sua conta.</p>

          {/* Exibe mensagem de erro, se houver */}
          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email" // Adicionado htmlFor e id para acessibilidade
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <label htmlFor="senha">Senha</label>
            <input
              id="senha" // Adicionado htmlFor e id para acessibilidade
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
      {/* LADO DIREITO: SLIDER */}
      {/* ======================================================= */}
      <div className="login-slider-section">
        <div className="slider-content">
          {sliderData.map((slide, index) => (
            // Renderiza cada slide, mas só o ativo fica visível (via CSS)
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
        
        {/* Navegação por pontos na parte inferior do slider */}
        <div className="slider-nav">
          {sliderData.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)} // Permite clicar para ir ao slide
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;