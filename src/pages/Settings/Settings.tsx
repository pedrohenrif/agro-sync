import React, { useEffect, useState } from 'react';
import { User, Building2, Shield, Bell, Save, Loader2 } from 'lucide-react';
import api from '../../service/api';

const Settings: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[300px] gap-3 text-emerald-600 font-semibold">
      <Loader2 size={20} className="animate-spin" /> Carregando...
    </div>
  );

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition disabled:bg-slate-50 disabled:text-slate-400";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500 mt-1">
          Dados de <strong className="text-slate-700">{data?.user?.name}</strong> da fazenda{' '}
          <strong className="text-slate-700">{data?.organization?.name}</strong>.
        </p>
      </div>

      <div className="flex gap-6 max-lg:flex-col">
        {/* Sidebar nav */}
        <aside className="w-48 flex-shrink-0 max-lg:w-full">
          <nav className="flex flex-col gap-1 max-lg:flex-row">
            {[
              { icon: <User size={16} />, label: 'Perfil e Fazenda', active: true },
              { icon: <Shield size={16} />, label: 'Segurança', active: false },
              { icon: <Bell size={16} />, label: 'Notificações', active: false },
            ].map(item => (
              <button key={item.label}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition
                  ${item.active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* User info */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Informações do Usuário</h2>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition">
                <Save size={15} /> Salvar
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Seu Nome</label>
                <input type="text" defaultValue={data?.user?.name} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>E-mail (Acesso)</label>
                <input type="text" value={data?.user?.email} disabled className={inputCls} />
              </div>
            </div>
          </section>

          {/* Org info */}
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Sua Organização (Empresa)</h2>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Building2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-emerald-600">{data?.organization?.name}</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  Status: <span className="text-emerald-600 font-semibold">● Ativo</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">ID de Registro: #{data?.organization?.id}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Settings;
