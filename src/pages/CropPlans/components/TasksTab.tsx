import React, { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
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

  return (
    <div className="tab-panel-container">
      <div className="input-row-container">
        <div className="input-field-fixed">
          <label className="field-label">Dia</label>
          <input 
            type="number" 
            value={day} 
            onChange={e => setDay(Number(e.target.value))} 
            className="form-input" 
          />
        </div>
        <div className="input-field-flex">
          <label className="field-label">Tarefa de Manejo</label>
          <input 
            type="text" 
            placeholder="Ex: Aplicação de NPK" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="form-input" 
          />
        </div>
        <button type="button" onClick={handleAdd} className="btn-primary-circle">
          <Plus size={20} />
        </button>
      </div>

      <div className="items-list-wrapper">
        <h4 className="list-title">Cronograma de Atividades</h4>
        {[...formData.planTasks].sort((a,b) => a.dayToExecute - b.dayToExecute).map((t, i) => (
          <div key={t.id || i} className="item-row-card">
            <div className="item-info">
              <span className="day-circle">{t.dayToExecute}d</span>
              <span className="item-name">{t.title}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, planTasks: formData.planTasks.filter((_: any, idx: number) => idx !== i)})} 
              className="btn-delete-ghost"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksTab;