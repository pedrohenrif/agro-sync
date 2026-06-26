import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TasksTab = ({ formData, setFormData }: any) => {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState(0);

  const handleAdd = () => {
    if (!title) return;
    setFormData({
      ...formData,
      planTasks: [...formData.planTasks, { id: uuidv4(), title, dayToExecute: day }]
    });
    setTitle(''); setDay(0);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-3">
        <div className="w-24">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Dia</label>
          <input type="number" value={day} onChange={e => setDay(Number(e.target.value))} className={inputCls} />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Tarefa de Manejo</label>
          <input type="text" placeholder="Ex: Aplicação de NPK" value={title}
            onChange={e => setTitle(e.target.value)} className={inputCls} />
        </div>
        <button type="button" onClick={handleAdd}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm">
          <Plus size={18} />
        </button>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Cronograma de Atividades</h4>
        {formData.planTasks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Nenhuma tarefa adicionada.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {[...formData.planTasks].sort((a: any, b: any) => a.dayToExecute - b.dayToExecute).map((t: any, i: number) => (
              <div key={t.id || i} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex-shrink-0 w-9 h-6 flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">
                    {t.dayToExecute}d
                  </span>
                  <span className="text-sm text-slate-800 truncate">{t.title}</span>
                </div>
                <button type="button"
                  onClick={() => setFormData({...formData, planTasks: formData.planTasks.filter((_: any, idx: number) => idx !== i)})}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTab;
