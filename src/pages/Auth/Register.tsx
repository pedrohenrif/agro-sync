import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../service/api';
import logoImg from '../../assets/logo_agrosync_sem_nome.png';

const inputWrapper = "flex items-center gap-2 bg-white border-[1.5px] border-slate-200 rounded-xl px-3 transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 [&_svg]:text-slate-400 [&:focus-within_svg]:text-emerald-500";
const inputField  = "flex-1 py-[13px] bg-transparent outline-none text-slate-900 text-[0.9375rem] placeholder:text-slate-400 font-sans";

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
    } catch {
      toast.error('Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const set = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [k]: e.target.value });

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
            Digitalize sua produção e potencialize seus resultados.
          </h2>
        </div>
      </div>

      {/* ── Form side ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-10 bg-slate-50 overflow-y-auto max-md:bg-white max-md:px-4 max-md:py-6 max-md:items-start">
        <div className="w-full max-w-[440px] bg-white p-10 rounded-[20px] shadow-xl border border-slate-200 animate-slide-up max-md:shadow-none max-md:border-0 max-md:p-6 max-md:rounded-none max-md:max-w-full">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 font-medium mb-6 hover:text-slate-900 transition-all">
            <ArrowLeft size={14} /> Voltar para login
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">Criar nova conta</h1>
            <p className="text-sm text-slate-500">Preencha os dados da sua organização.</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex gap-4 max-md:flex-col">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Seu Nome</label>
                <div className={inputWrapper}>
                  <User size={20} />
                  <input type="text" placeholder="Nome completo" onChange={set('name')} className={inputField} required />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Nome da Fazenda</label>
                <div className={inputWrapper}>
                  <Building2 size={20} />
                  <input type="text" placeholder="Ex: AgroSync Ltda" onChange={set('organizationName')} className={inputField} required />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">E-mail principal</label>
              <div className={inputWrapper}>
                <Mail size={20} />
                <input type="email" placeholder="seu@email.com" onChange={set('email')} className={inputField} required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Senha de acesso</label>
              <div className={inputWrapper}>
                <Lock size={20} />
                <input type="password" placeholder="Mínimo 6 caracteres" onChange={set('password')} className={inputField} required />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center gap-2 w-full py-[14px] bg-emerald-500 text-white font-bold text-[0.9375rem] rounded-xl transition-all hover:bg-emerald-600 hover:-translate-y-px shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] disabled:opacity-65 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
