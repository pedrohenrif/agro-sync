import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../service/api';
// Certifique-se de que o caminho da imagem está correto
import logoImg from '../../assets/logo_agrosync_sem_nome.png'; 
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await api.post('/auth/login', { email, password });
        
        // Verificando onde o token está escondido
        const token = response.data.token || 
                      response.data.accessToken || 
                      (response.data.data && response.data.data.token);

        if (token) {
          localStorage.setItem('token', token);
          console.log('Token salvo com sucesso!');
          toast.success('Bem-vindo!');
          navigate('/dashboard');
        } else {
          // Se cair aqui, a gente precisa ver o JSON.stringify acima
          console.error('Resposta sem token conhecido:', response.data);
          toast.error('Erro na estrutura de login do servidor.');
        }
      } catch (err) {
        console.error('Erro no Axios:', err);
        toast.error('Falha na conexão ou dados inválidos.');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="auth-split-container">
      {/* LADO ESQUERDO - BRANDING/LOGO */}
      <div className="auth-brand-side">
        <div className="brand-content">
          <img src={logoImg} alt="AgroSync Logo" className="brand-logo-big" />
          <h2 className="brand-tagline">O futuro do seu agronegócio começa aqui.</h2>
        </div>
      </div>

      {/* LADO DIREITO - FORMULÁRIO */}
      <div className="auth-form-side">
        <div className="form-box">
          <div className="auth-header-simple">
            <h1>Acesse sua conta</h1>
            <p>Entre com suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-input-group">
              <label>E-mail corporativo</label>
              <div className="input-wrapper">
                <Mail size={20} />
                <input 
                  type="email" 
                  placeholder="exemplo@fazenda.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Senha</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Autenticando...' : 'Entrar no Painel'} <LogIn size={18} />
            </button>
          </form>

          <div className="auth-footer-simple">
            <p>Ainda não possui acesso? <Link to="/register">Cadastre sua fazenda <ArrowRight size={14} /></Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;