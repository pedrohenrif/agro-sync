import React from 'react';

const InfoTab = ({ formData, setFormData }: any) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'durationDays' ? Number(value) : value });
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelCls}>Nome do Plano de Cultivo</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange}
          className={inputCls} placeholder="Ex: Alface Americana - Ciclo Verão" />
      </div>
      <div>
        <label className={labelCls}>Cultura Principal</label>
        <input type="text" name="culture" value={formData.culture} onChange={handleChange}
          className={inputCls} placeholder="Ex: Alface" />
      </div>
      <div>
        <label className={labelCls}>Duração Estimada (Dias)</label>
        <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange}
          className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Descrição e Observações</label>
        <textarea name="description" value={formData.description} onChange={handleChange}
          className={inputCls + " resize-none"} rows={4}
          placeholder="Descreva detalhes do manejo ou recomendações técnicas..." />
      </div>
    </div>
  );
};

export default InfoTab;
