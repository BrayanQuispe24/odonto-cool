"use no memo";
import React, { useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import type { EventClickArg } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { Cita, CitaEstado } from '../types/cita';
import { useAuthStore } from '../../auth/store/authStore';

interface CitaCalendarViewProps {
  citas: Cita[];
  onEdit: (cita: Cita) => void;
  onViewDetails?: (cita: Cita) => void;
  onDateClick?: (dateStr: string, timeStr?: string) => void;
}

export const CitaCalendarView: React.FC<CitaCalendarViewProps> = ({
  citas,
  onEdit,
  onViewDetails,
  onDateClick
}) => {
  const { user } = useAuthStore();
  const isDoctorRole = user?.rol?.nombre === 'Doctor';
  const calendarRef = useRef<FullCalendar>(null);

  const getStatusColor = (estado: CitaEstado) => {
    switch (estado) {
      case 'confirmada': return '#00C2E0'; // Cyan
      case 'finalizada': return '#10B981'; // Emerald
      case 'cancelada': return '#F43F5E'; // Rose
      case 'pendiente': return '#F59E0B'; // Amber
      default: return '#0840A8'; // Azul oscuro
    }
  };

  const calendarEvents = useMemo(() => {
    return citas.map((cita) => {
      const pacienteNombre = cita.paciente 
        ? `${cita.paciente.nombre} ${cita.paciente.apellido}` 
        : cita.nombre_paciente_unregistered || 'Sin Paciente';
      
      const doctorNombre = cita.doctor ? `Dr. ${cita.doctor.nombre}` : '';

      const fechaLimpia = cita.fecha ? String(cita.fecha).split('T')[0] : '';
      const horaInicio = cita.hora_inicio ? cita.hora_inicio.substring(0, 5) : '00:00';
      const horaFin = cita.hora_fin ? cita.hora_fin.substring(0, 5) : '01:00';

      return {
        id: String(cita.id),
        title: pacienteNombre,
        start: `${fechaLimpia}T${horaInicio}:00`,
        end: `${fechaLimpia}T${horaFin}:00`,
        backgroundColor: getStatusColor(cita.estado),
        borderColor: getStatusColor(cita.estado),
        extendedProps: { ...cita }
      };
    });
  }, [citas]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const citaId = Number(clickInfo.event.id);
    const cita = citas.find(c => c.id === citaId);
    if (cita && onViewDetails) {
      onViewDetails(cita);
    }
  };

  const handleDateClick = (clickInfo: DateClickArg) => {
    if (!isDoctorRole) return; // Sólo doctores pueden crear
    if (onDateClick) {
      // clickInfo.dateStr format is "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss-04:00"
      const parts = clickInfo.dateStr.split('T');
      const dateStr = parts[0];
      const timeStr = parts[1] ? parts[1].substring(0, 5) : undefined;
      onDateClick(dateStr, timeStr);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm p-3">
      {/* Añadimos estilos custom en una etiqueta style para modificar las variables CSS nativas de FullCalendar y su apariencia */}
      <style>{`
        .fc {
          --fc-border-color: rgba(148, 163, 184, 0.2);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(248, 250, 252, 1);
          --fc-neutral-text-color: #334155;
          --fc-today-bg-color: rgba(0, 119, 212, 0.05);
          --fc-button-bg-color: #0077D4;
          --fc-button-border-color: #0077D4;
          --fc-button-hover-bg-color: #0840A8;
          --fc-button-hover-border-color: #0840A8;
          --fc-button-active-bg-color: #0840A8;
          --fc-button-active-border-color: #0840A8;
          --fc-event-border-color: transparent;
          --fc-event-text-color: #ffffff;
          font-family: inherit;
        }
        .dark .fc {
          --fc-border-color: rgba(30, 41, 59, 1);
          --fc-neutral-bg-color: rgba(0, 28, 61, 1);
          --fc-neutral-text-color: #94a3b8;
          --fc-today-bg-color: rgba(0, 119, 212, 0.1);
        }
        .fc-theme-standard .fc-scrollgrid {
          border: 1px solid var(--fc-border-color);
          border-radius: 2px;
          overflow: hidden;
        }
        .fc-header-toolbar {
          margin-bottom: 1em !important;
        }
        .fc-toolbar-title {
          font-size: 1rem !important;
          font-weight: 700 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0840A8;
        }
        .dark .fc-toolbar-title {
          color: #e2e8f0;
        }
        .fc .fc-button {
          font-size: 0.7rem !important;
          font-weight: 600 !important;
          text-transform: uppercase;
          border-radius: 2px !important;
          padding: 0.25rem 0.5rem !important;
        }
        .fc-col-header-cell {
          padding: 0.25rem 0;
          background-color: var(--fc-neutral-bg-color);
        }
        .fc-col-header-cell-cushion {
          color: var(--fc-neutral-text-color);
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .fc-event {
          cursor: pointer;
          border-radius: 2px;
          padding: 1px 3px;
          font-size: 0.65rem;
          font-weight: 600;
          transition: filter 0.1s;
        }
        .fc-event:hover {
          filter: brightness(0.95);
        }
        .fc-timegrid-slot {
          height: 2.5em !important; 
        }
        .fc-timegrid-slot-label-cushion {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--fc-neutral-text-color);
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locales={[esLocale]}
        locale="es"
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        displayEventEnd={false}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        height="700px"
      />
    </div>
  );
};
