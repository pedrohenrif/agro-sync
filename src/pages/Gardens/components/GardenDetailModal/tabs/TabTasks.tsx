import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, Calendar, AlertTriangle, ListChecks } from 'lucide-react';
import * as gardenService from '../../../../../service/gardenService';
import * as taskService from '../../../../../service/taskService'; // Importar para o Delete/Update
import EditTaskModal from '../../../../TaskManager/EditTaskModal'; // Ajuste o caminho se necessário

import './TabTasks.css';

const TabTasks: React.FC<{ garden: any }> = ({ garden }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null); // Estado para o modal

  // Memorizando a função de busca para poder reusar após edição/exclusão
  const fetchGardenTasks = useCallback(() => {
    setLoading(true);
    gardenService.getGardenTasks(garden.id)
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [garden.id]);

  useEffect(() => {
    fetchGardenTasks();
  }, [fetchGardenTasks]);

  const isOverdue = (dueDate: string, status: string) => {
    // Mantendo sua lógica original de data
    return status !== 'DONE' && new Date(dueDate) < new Date();
  };

  return (
    <div className="tab-tasks-container gdm-tasks-wrapper">
      <div className="tasks-header">
        <div className="title-group">
          <ListChecks size={22} className="text-primary" />
          <div>
            <h3>Cronograma do Lote</h3>
            <p>Gerencie as atividades planejadas para este canteiro.</p>
          </div>
        </div>
        <div className="task-stats">
          <span className="stat-item">
            <strong>{tasks.filter(t => t.status === 'DONE').length}</strong> concluídas
          </span>
        </div>
      </div>

      <div className="task-timeline">
        {loading ? (
          <p className="loading-msg">Carregando cronograma...</p>
        ) : tasks.length === 0 ? (
          <div className="empty-tasks">
            <Calendar size={48} />
            <p>Nenhuma tarefa agendada para este lote.</p>
          </div>
        ) : (
          tasks.map(task => {
            const overdue = isOverdue(task.dueDate, task.status);
            
            return (
              <div 
                key={task.id} 
                className={`task-card status-${task.status.toLowerCase()} ${overdue ? 'overdue' : ''}`}
                onClick={() => setSelectedTask(task)} // <--- Abre o modal ao clicar em qualquer parte do card
                style={{ cursor: 'pointer' }}
              >
                <div className="task-indicator">
                  {task.status === 'DONE' ? (
                    <CheckCircle size={24} className="icon-done" />
                  ) : overdue ? (
                    <AlertTriangle size={24} className="icon-overdue" />
                  ) : (
                    <Clock size={24} className="icon-pending" />
                  )}
                  <div className="line"></div>
                </div>

                <div className="task-content">
                  <div className="task-header-row">
                    <h4>{task.title}</h4>
                    <span className={`status-badge ${overdue ? 'overdue' : task.status.toLowerCase()}`}>
                      {overdue ? 'ATRASADO' : task.status === 'DONE' ? 'CONCLUÍDO' : 'PENDENTE'}
                    </span>
                  </div>
                  
                  {/* Descrição com classe de quebra de linha */}
                  <p className="task-desc">{task.description}</p>
                  
                  <div className="task-footer">
                    <span className="task-date">
                      <Calendar size={14} />
                      {new Date(task.dueDate).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Edição integrado na Aba */}
      <EditTaskModal 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchGardenTasks} // Recarrega a lista da aba após editar
        onDelete={async (id) => {
          await taskService.deleteTask(id);
          fetchGardenTasks(); // Recarrega após excluir
        }}
      />
    </div>
  );
};

export default TabTasks;