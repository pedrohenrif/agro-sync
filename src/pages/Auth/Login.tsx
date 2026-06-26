import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../service/api';
import logoImg from '../../assets/logo_agrosync_sem_nome.png';

const inputWrapper = "flex items-center gap-2 bg-white border-[1.5px] border-slate-200 rounded-xl px-3 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 [&_svg]:text-slate-400 [&:focus-within_svg]:text-emerald-500";
const inputField  = "flex-1 py-[13px] bg-transparent outline-none text-slate-900 text-[0.9375rem] placeholder:text-slate-400 font-sans";

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
      const token = response.data.token || response.data.accessToken || response.data.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Bem-vindo!');
        navigate('/dashboard');
      } else {
        toast.error('Erro na estrutura de login do servidor.');
      }
    } catch {
      toast.error('Falha na conexão ou dados inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full max-md:flex-col">
      {/* ── Branding side ── */}
      <div className="flex-[1.2] bg-gradient-to-br from-slate-900 via-[#0f2920] to-slate-900 flex items-center justify-center p-16 relative overflow-hidden max-md:flex-none max-md:min-h-[320px] max-md:p-12">
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] -top-[150px] -left-[150px] pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] -bottom-[100px] -right-[100px] pointer-events-none" />
        <div className="relative z-10 text-center max-w-[480px]">
          <img
            src={logoImg}
            alt="AgroSync Logo"
            className="w-full max-w-[360px] h-auto object-contain mb-8 drop-shadow-[0_4px_32px_rgba(16,185,129,0.2)] max-md:max-w-[200px] max-md:mb-5"
          />
          <h2 className="text-[1.7rem] font-light leading-[1.45] opacity-85 text-white/90 max-md:text-[1.3rem]">
            O futuro do seu agronegócio começa aqui.
          </h2>
        </div>
      </div>

      {/* ── Form side ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-10 bg-slate-50 overflow-y-auto max-md:bg-white max-md:px-4 max-md:py-6 max-md:items-start">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-[20px] shadow-xl border border-slate-200 animate-slide-up max-md:shadow-none max-md:border-0 max-md:p-6 max-md:rounded-none max-md:max-w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">Acesse sua conta</h1>
            <p className="text-sm text-slate-500">Entre com suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">E-mail corporativo</label>
              <div className={inputWrapper}>
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="exemplo@fazenda.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputField}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Senha</label>
              <div className={inputWrapper}>
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputField}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center gap-2 w-full py-[14px] bg-emerald-500 text-white font-bold text-[0.9375rem] rounded-xl transition-all hover:bg-emerald-600 hover:-translate-y-px shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] disabled:opacity-65 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Painel'} <LogIn size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>
              Ainda não possui acesso?{' '}
              <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline inline-flex items-center gap-1">
                Cadastre sua fazenda <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
