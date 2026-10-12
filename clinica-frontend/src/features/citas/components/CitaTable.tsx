import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  User,
  Building,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Receipt,
  LayoutGrid,
  List,
  CalendarDays,
} from 'lucide-react';
import type { Cita, CitaEstado } from '../types/cita';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';
import { useAuthStore } from '../../auth/store/authStore';
import { CitaCalendarView } from './CitaCalendarView';

interface CitaTableProps {
  citas: Cita[];
  onEdit: (cita: Cita) => void;
  onDelete: (cita: Cita) => void;
  onViewDetails?: (cita: Cita) => void;
  onOpenBoleta?: (cita: Cita) => void;
}

export const CitaTable: React.FC<CitaTableProps> = ({
  citas,
  onEdit,
  onDelete,
  onViewDetails,
  onOpenBoleta,
}) => {
  const { user } = useAuthStore();
  const isDoctorRole = user?.rol?.nombre === 'Doctor';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState<string>('all');
  const [selectedEstado, setSelectedEstado] = useState<string>('all');
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'calendar'>('calendar');
  const pageSize = 12;

  useEffect(() => {
    getSucursalesApi()
      .then((list) => setSucursales(list))
      .catch(() => {});
  }, []);

  const filteredCitas = useMemo(() => {
    return citas.filter((cita) => {
      const term = searchTerm.toLowerCase();
      const numCita = (cita.numero_cita || '').toLowerCase();
      const registeredName = cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellido}`.toLowerCase() : '';
      const unregisteredName = (cita.nombre_paciente_unregistered || '').toLowerCase();
      const doctorName = cita.doctor ? `${cita.doctor.nombre} ${cita.doctor.apellido}`.toLowerCase() : '';

      const matchesSearch =
        numCita.includes(term) ||
        registeredName.includes(term) ||
        unregisteredName.includes(term) ||
        doctorName.includes(term);

      const matchesSucursal =
        selectedSucursal === 'all' ||
        (cita.sucursal_id ? String(cita.sucursal_id) === selectedSucursal : false);

      const matchesEstado =
        selectedEstado === 'all' || cita.estado === selectedEstado;

      return matchesSearch && matchesSucursal && matchesEstado;
    });
  }, [citas, searchTerm, selectedSucursal, selectedEstado]);

  const totalPages = Math.ceil(filteredCitas.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCitas = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredCitas.slice(start, start + pageSize);
  }, [filteredCitas, safeCurrentPage, pageSize]);

  const getStatusBadge = (estado: CitaEstado) => {
    switch (estado) {
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-cyan-50 dark:bg-cyan-900/30 text-primary dark:text-secondary border border-cyan-200 dark:border-cyan-800">
            <CheckCircle2 size={10} />
            CONFIRMADA
          </span>
        );
      case 'finalizada':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={10} />
            FINALIZADA
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle size={10} />
            CANCELADA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock3 size={10} />
            PENDIENTE
          </span>
        );
    }
  };

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredCitas.length);

  return (
    <div className="w-full flex flex-col bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden shrink-0 min-h-[60vh]">
      {/* Search & Filter Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <h3 className="font-bold text-small uppercase tracking-wider text-primary-dark dark:text-slate-300 flex items-center gap-1.5 shrink-0">
            <Calendar size={13} className="text-primary dark:text-secondary" />
            <span className="hidden sm:inline">Citas Médicas ({filteredCitas.length})</span>
          </h3>

          <div className="flex-1 max-w-lg">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por cita, paciente o doctor..."
                className="w-full pl-8 pr-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search size={13} className="absolute left-2.5 top-2 text-slate-400 dark:text-slate-500" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sucursal Filter - Solo para No-Doctores */}
            {!isDoctorRole && (
              <div className="flex items-center gap-1.5">
                <Filter size={12} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
                <select
                  value={selectedSucursal}
                  onChange={(e) => {
                    setSelectedSucursal(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-28 sm:w-32 px-2 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="all">Todas sucursales</option>
                  {sucursales.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre || s.ubicacion}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Estado Filter */}
            <div className="flex items-center gap-1.5">
              {isDoctorRole && <Filter size={12} className="text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />}
              <select
                value={selectedEstado}
                onChange={(e) => {
                  setSelectedEstado(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-28 sm:w-32 px-2 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="confirmada">Confirmadas</option>
                <option value="finalizada">Finalizadas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>

            {/* View toggles */}
            <div className="flex bg-slate-200 dark:bg-dark-bg rounded-sm p-0.5 border border-slate-300 dark:border-slate-800 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-dark-surface text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Vista Cuadrícula"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-dark-surface text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Vista Tabla"
              >
                <List size={13} />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-dark-surface text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Vista Calendario"
              >
                <CalendarDays size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-dark-surface">
        {viewMode === 'calendar' ? (
          <div className="p-3 h-full">
            <CitaCalendarView 
              citas={filteredCitas}
              onEdit={onEdit}
              onViewDetails={onViewDetails}
              onDateClick={(date, time) => {}}
            />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 bg-slate-50 dark:bg-dark-bg">
            {paginatedCitas.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 font-semibold text-small">
                No se encontraron citas médicas registradas.
              </div>
            ) : (
              paginatedCitas.map((cita) => (
                <div
                  key={cita.id}
                  className="relative group flex flex-col p-3 rounded-sm border transition-all duration-200 bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800 hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono font-bold text-tiny text-primary dark:text-secondary bg-slate-100 dark:bg-dark-bg px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {cita.numero_cita}
                    </span>
                    {getStatusBadge(cita.estado)}
                  </div>

                  <div className="flex items-start gap-2 flex-1 mt-1">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-dark-bg text-primary dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800">
                      <User size={14} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-small font-bold truncate text-primary-dark dark:text-white">
                        {cita.paciente
                          ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                          : cita.nombre_paciente_unregistered || 'Sin paciente'}
                      </h4>
                      {cita.paciente ? (
                        <span className="text-tiny font-mono font-semibold text-slate-500 dark:text-slate-400">
                          {cita.paciente.codigo_paciente}
                        </span>
                      ) : (
                        <span className="text-micro font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                          No registrado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-tiny text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1 bg-slate-50 dark:bg-dark-bg px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                        <Calendar size={11} className="text-primary dark:text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {cita.fecha ? String(cita.fecha).split('T')[0] : '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 dark:bg-dark-bg px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                        <Clock size={11} className="text-primary dark:text-slate-400" />
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                          {cita.hora_inicio?.substring(0, 5)} - {cita.hora_fin?.substring(0, 5)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-tiny font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-dark-bg px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800 truncate">
                      <Building size={10} className="shrink-0 text-slate-400" />
                      {cita.sucursal ? cita.sucursal.nombre || cita.sucursal.ubicacion : 'Sin sucursal'}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(cita)}
                          title="Ver cita"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(cita)}
                        title="Editar"
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(cita)}
                        title="Eliminar"
                        className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {onOpenBoleta && (
                      <button
                        onClick={() => onOpenBoleta(cita)}
                        className={`px-2 py-1 rounded text-tiny font-bold flex items-center gap-1 transition-colors ${
                          cita.boletaServicioPrestado
                            ? 'bg-slate-100 dark:bg-dark-bg text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800'
                            : 'bg-[#0077D4] hover:bg-[#0840A8] text-white'
                        }`}
                      >
                        <Receipt size={11} />
                        <span>{cita.boletaServicioPrestado ? 'Ver Boleta' : 'Cobrar'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-small whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-dark-bg text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 font-bold w-24">Nº Cita</th>
                  <th className="px-4 py-2 font-bold">Paciente</th>
                  <th className="px-4 py-2 font-bold w-32">Sucursal</th>
                  <th className="px-4 py-2 font-bold w-32">Fecha / Hora</th>
                  <th className="px-4 py-2 font-bold w-28">Estado</th>
                  <th className="px-4 py-2 font-bold text-right w-28">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                {paginatedCitas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400 font-semibold">
                      No se encontraron citas médicas registradas.
                    </td>
                  </tr>
                ) : (
                  paginatedCitas.map((cita) => {
                    return (
                      <tr
                        key={cita.id}
                        className="hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors"
                      >
                        <td className="px-4 py-2">
                          <span className="font-mono font-bold text-primary dark:text-secondary">
                            {cita.numero_cita}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <User size={13} className="text-slate-400 shrink-0" />
                            <div>
                              <div className="font-bold text-primary-dark dark:text-white">
                                {cita.paciente
                                  ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                                  : cita.nombre_paciente_unregistered || 'Sin paciente'}
                              </div>
                              <div className="text-tiny font-mono mt-0.5">
                                {cita.paciente ? (
                                  <span className="text-slate-500 dark:text-slate-400">{cita.paciente.codigo_paciente}</span>
                                ) : (
                                  <span className="inline-block px-1.5 py-0.5 rounded text-micro font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                    No registrado
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Building size={11} className="text-slate-400" />
                            {cita.sucursal ? cita.sucursal.nombre || cita.sucursal.ubicacion : 'Sin sucursal'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-semibold">
                              <Calendar size={11} className="text-slate-400" />
                              <span>{cita.fecha ? String(cita.fecha).split('T')[0] : '-'}</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
                              <Clock size={10} className="text-slate-400" />
                              <span>{cita.hora_inicio?.substring(0, 5)} - {cita.hora_fin?.substring(0, 5)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {getStatusBadge(cita.estado)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {onOpenBoleta && (
                              <button
                                onClick={() => onOpenBoleta(cita)}
                                title={cita.boletaServicioPrestado ? `Ver Boleta Nº ${cita.boletaServicioPrestado.numero_boleta}` : "Cobrar"}
                                className={`p-1 rounded transition-colors cursor-pointer ${
                                  cita.boletaServicioPrestado
                                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary'
                                    : 'bg-[#0077D4] hover:bg-[#0840A8] text-white'
                                }`}
                              >
                                <Receipt size={13} />
                              </button>
                            )}
                            {onViewDetails && (
                              <button
                                onClick={() => onViewDetails(cita)}
                                title="Ver cita"
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors"
                              >
                                <Eye size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => onEdit(cita)}
                              title="Editar"
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-dark-bg dark:hover:bg-slate-800 text-primary dark:text-secondary transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => onDelete(cita)}
                              title="Eliminar"
                              className="p-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER PAGINATION */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between text-small text-slate-500 dark:text-slate-400 shrink-0">
        <div>
          Mostrando <strong>{filteredCitas.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredCitas.length}</strong>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} />
          </button>
          
          <span className="px-2 font-semibold">
            Página {safeCurrentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
