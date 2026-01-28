import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../service/api';
import logoImg from '../../assets/logo_agrosync_sem_nome.png'; 
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', organizationName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Fazenda registrada com sucesso!');
      navigate('/login');
    } catch (err) {
      toast.error('Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* LADO ESQUERDO - BRANDING */}
      <div className="auth-brand-side">
        <div className="brand-content">
          <img src={logoImg} alt="AgroSync Logo" className="brand-logo-big" />
          <h2 className="brand-tagline">Digitalize sua produção e potencialize seus resultados.</h2>
        </div>
      </div>

      {/* LADO DIREITO - FORMULÁRIO */}
      <div className="auth-form-side">
        <div className="form-box">
          <Link to="/login" className="back-link-top"><ArrowLeft size={14} /> Voltar para login</Link>
          <div className="auth-header-simple">
            <h1>Criar nova conta</h1>
            <p>Preencha os dados da sua organização.</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-row">
              <div className="auth-input-group">
                <label>Seu Nome</label>
                <div className="input-wrapper">
                  <User size={20} />
                  <input type="text" placeholder="Nome completo" onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
              </div>
               <div className="auth-input-group">
                <label>Nome da Fazenda</label>
                <div className="input-wrapper">
                  <Building2 size={20} />
                  <input type="text" placeholder="Ex: AgroSync Ltda" onChange={e => setFormData({...formData, organizationName: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className="auth-input-group">
              <label>E-mail principal</label>
              <div className="input-wrapper">
                <Mail size={20} />
                <input type="email" placeholder="seu@email.com" onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Senha de acesso</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input type="password" placeholder="Mínimo 6 caracteres" onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;