// ARQUIVO: src/pages/SeasonalCalendar/SeasonalCalendar.tsx

import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importa o idioma Português

// 1. IMPORTAR O CSS PADRÃO DA BIBLIOTECA (OBRIGATÓRIO)
import 'react-big-calendar/lib/css/react-big-calendar.css';
// 2. IMPORTAR NOSSO CSS CUSTOMIZADO (VEM DEPOIS)
import './SeasonalCalendar.css'; 

// --- Configuração do Localizador (para Português) ---
const locales = {
  'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }), // Começa a semana no Domingo
  getDay,
  locales,
});

// --- Interface para Nossos Eventos ---
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: 'planting' | 'harvesting'; // Nosso tipo customizado para estilização
}

// ==========================================================
// !! DADOS FICTÍCIOS (MOCK DATA) !!
// (No futuro, isso viria da sua API)
// ==========================================================
const MOCK_EVENTS: CalendarEvent[] = [
  // --- Alface (Planta bem na Primavera e Outono) ---
  {
    title: 'Plantar Alface',
    start: new Date(2025, 2, 1), // 1 de Março (Mês 2)
    end: new Date(2025, 4, 31), // 31 de Maio (Mês 4)
    allDay: true,
    type: 'planting'
  },
  {
    title: 'Colher Alface',
    start: new Date(2025, 4, 15), // 15 de Maio
    end: new Date(2025, 6, 15), // 15 de Julho
    allDay: true,
    type: 'harvesting'
  },
  // --- Tomate (Planta no calor) ---
  {
    title: 'Plantar Tomate',
    start: new Date(2025, 8, 1), // 1 de Setembro (Mês 8)
    end: new Date(2025, 10, 30), // 30 de Novembro (Mês 10)
    allDay: true,
    type: 'planting'
  },
  {
    title: 'Colher Tomate',
    start: new Date(2025, 11, 15), // 15 de Dezembro
    end: new Date(2026, 1, 28), // 28 de Fevereiro (ano seguinte)
    allDay: true,
    type: 'harvesting'
  },
  // --- Beterraba (Planta o ano todo, exceto calor extremo) ---
  {
    title: 'Plantar Beterraba',
    start: new Date(2025, 2, 1), // 1 de Março
    end: new Date(2025, 9, 31), // 31 de Outubro
    allDay: true,
    type: 'planting'
  },
  {
    title: 'Colher Beterraba',
    start: new Date(2025, 4, 15), // 15 de Maio
    end: new Date(2025, 11, 31), // 31 de Dezembro
    allDay: true,
    type: 'harvesting'
  }
];

// --- Componente da Página ---
const SeasonalCalendar = () => {

  // Mensagens do calendário em Português
  const messages = useMemo(() => ({
    allDay: 'Dia todo',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período.',
    showMore: (total: number) => `+${total} mais`,
  }), []);

  // Função para aplicar estilos customizados aos eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: event.type === 'planting' 
        ? 'var(--primary-color, #2e7d32)' // Verde para plantar
        : 'var(--icon-total-bg, #FF9800)', // Laranja para colher
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2><span role="img" aria-label="calendar">📅</span> Calendário Sazonal</h2>
        <p>Veja as melhores épocas para plantar e colher suas culturas.</p>
      </div>

      {/* Container do Calendário */}
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={MOCK_EVENTS}
          startAccessor="start"
          endAccessor="end"
          messages={messages} // Traduz a UI para Português
          culture='pt-BR' // Define a cultura
          style={{ height: 700 }} // Define uma altura
          eventPropGetter={eventStyleGetter} // Aplica nosso estilo customizado
          views={['month']} // Mostra apenas a visão de "Mês"
          defaultView="month"
        />
      </div>
    </div>
  );
};

export default SeasonalCalendar;