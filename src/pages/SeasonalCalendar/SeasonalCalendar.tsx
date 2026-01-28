import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Filter, AlertCircle } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'react-toastify';

import './SeasonalCalendar.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    type: 'TASK' | 'WITHDRAWAL'; // Tarefa ou Período de Carência
    description: string;
  };
}

const SeasonalCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      // Buscamos as tarefas do banco
      const response = await api.get('/tasks');
      
      const formattedEvents = response.data.map((task: any) => ({
        id: String(task.id),
        title: task.title,
        start: task.dueDate,
        // Cores baseadas na prioridade ou status
        backgroundColor: task.status === 'DONE' ? '#10b981' : (task.priority === 'HIGH' ? '#ef4444' : '#3b82f6'),
        borderColor: 'transparent',
        extendedProps: {
          type: 'TASK',
          description: task.description
        }
      }));

      setEvents(formattedEvents);
    } catch (error) {
      toast.error("Erro ao carregar cronograma.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="calendar-page-container">
      <header className="calendar-header">
        <div className="header-info">
          <h1><CalendarIcon size={28} /> Calendário de Manejo Sazonal</h1>
          <p>Acompanhe o ciclo de vida dos seus lotes e períodos de carência.</p>
        </div>
        
        <div className="calendar-legend">
          <span className="legend-item"><span className="dot task-high"></span> Urgente</span>
          <span className="legend-item"><span className="dot task-normal"></span> Manejo</span>
          <span className="legend-item"><span className="dot task-done"></span> Concluído</span>
          <span className="legend-item"><span className="dot withdrawal"></span> Carência</span>
        </div>
      </header>

      <div className="calendar-main-card">
        {isLoading ? (
          <div className="loading-state">Sincronizando calendário...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana'
            }}
            eventClick={(info) => {
              toast.info(`${info.event.title}: ${info.event.extendedProps.description}`);
            }}
            height="auto"
          />
        )}
      </div>
    </div>
  );
};

export default SeasonalCalendar;