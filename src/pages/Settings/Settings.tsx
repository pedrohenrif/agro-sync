import React, { useEffect, useState } from 'react';
import { User, Building2, Shield, Bell, Save, Loader2 } from 'lucide-react';
import api from '../../service/api';
import './Settings.css';

const Settings: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/auth/me');
        setData(res.data);
      } catch (err) {
        console.error("Erro ao carregar configurações");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <div className="loading-state"><Loader2 className="animate-spin" /> Carregando...</div>;

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Configurações</h1>
        <p>Dados de <strong>{data?.user?.name}</strong> da fazenda <strong>{data?.organization?.name}</strong>.</p>
      </header>

      <div className="settings-grid">
        <aside className="settings-nav">
          <button className="nav-item active"><User size={20}/> Perfil e Fazenda</button>
          <button className="nav-item"><Shield size={20}/> Segurança</button>
          <button className="nav-item"><Bell size={20}/> Notificações</button>
        </aside>

        <main className="settings-content">
          <section className="settings-section">
            <div className="section-header">
              <h2>Informações do Usuário</h2>
              <button className="save-btn"><Save size={18}/> Salvar</button>
            </div>
            
            <div className="form-group">
              <label>Seu Nome</label>
              <input type="text" defaultValue={data?.user?.name} />
            </div>
            <div className="form-group">
              <label>E-mail (Acesso)</label>
              <input type="text" value={data?.user?.email} disabled />
            </div>
          </section>

          <section className="settings-section mt-30">
            <div className="section-header">
              <h2>Sua Organização (Empresa)</h2>
            </div>
            <div className="org-card">
              <div className="org-icon"><Building2 size={32} /></div>
              <div className="org-info">
                <h3 style={{ fontSize: '1.4rem', color: '#10b981' }}>
                  {data?.organization?.name}
                </h3>
                <p>Status: <span style={{ color: '#059669', fontWeight: 'bold' }}>● Ativo</span></p>
                <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>ID de Registro: #{data?.organization?.id}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Settings;