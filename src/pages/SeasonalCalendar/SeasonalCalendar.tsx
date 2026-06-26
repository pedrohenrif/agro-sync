import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import api from '../../service/api';
import { toast } from 'react-toastify';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: { type: 'TASK' | 'WITHDRAWAL'; description: string };
}

const LEGEND = [
  { color: 'bg-red-500',     label: 'Urgente' },
  { color: 'bg-blue-500',    label: 'Manejo' },
  { color: 'bg-emerald-500', label: 'Concluído' },
];

const SeasonalCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks').then(res => {
      setEvents(res.data.map((task: any) => ({
        id: String(task.id),
        title: task.title,
        start: task.dueDate,
        backgroundColor: task.status === 'DONE' ? '#10b981' : task.priority === 'HIGH' ? '#ef4444' : '#3b82f6',
        borderColor: 'transparent',
        extendedProps: { type: 'TASK', description: task.description }
      })));
    }).catch(() => toast.error("Erro ao carregar cronograma."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <CalendarIcon size={28} className="text-emerald-600" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Calendário de Manejo Sazonal</h1>
            <p className="text-sm text-slate-500">Acompanhe o ciclo de vida dos seus lotes e períodos de carência.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {LEGEND.map(l => (
            <span key={l.label} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} /> {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 gap-3 text-emerald-600 font-semibold">
            <Loader2 size={20} className="animate-spin" /> Sincronizando calendário...
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            events={events}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek' }}
            buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana' }}
            eventClick={info => toast.info(`${info.event.title}: ${info.event.extendedProps.description}`)}
            height="auto"
          />
        )}
      </div>
    </div>
  );
};

export default SeasonalCalendar;
