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
} from 'lucide-react';
import type { Cita, CitaEstado } from '../types/cita';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';
import { useAuthStore } from '../../auth/store/authStore';

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
  const pageSize = 8;

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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40">
            <CheckCircle2 size={11} className="text-[#0077D4] dark:text-[#00C2E0]" />
            Confirmada
          </span>
        );
      case 'finalizada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
            Finalizada
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40">
            <XCircle size={11} className="text-rose-400" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-600 dark:text-amber-300 border border-amber-500/40">
            <Clock3 size={11} className="text-amber-400" />
            Pendiente
          </span>
        );
    }
  };

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredCitas.length);

  return (
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0077D4] dark:text-[#00C2E0]">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por cita, paciente o doctor..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#0077D4] dark:text-blue-200/70 hover:text-[#0840A8] dark:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sucursal Filter - Solo para No-Doctores */}
          {!isDoctorRole && (
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-[#0077D4] dark:text-[#00C2E0]" />
              <select
                value={selectedSucursal}
                onChange={(e) => {
                  setSelectedSucursal(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2 px-3 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer min-w-[160px]"
              >
                <option value="all" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todas las sucursales</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">
                    {s.nombre || s.ubicacion} ({s.codigo_sucursal})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Estado Filter */}
          <select
            value={selectedEstado}
            onChange={(e) => {
              setSelectedEstado(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todos los estados</option>
            <option value="pendiente" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Pendientes</option>
            <option value="confirmada" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Confirmadas</option>
            <option value="finalizada" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Finalizadas</option>
            <option value="cancelada" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Canceladas</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E5F7FF] dark:bg-[#0840A8]/40 border-b border-[#0840A8]/15 dark:border-[#0840A8]/60 text-[11px] font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-blue-100 select-none">
              <th className="py-3.5 px-4">Nº CITA</th>
              <th className="py-3.5 px-4">PACIENTE</th>
              <th className="py-3.5 px-4">SUCURSAL</th>
              <th className="py-3.5 px-4">FECHA / HORA</th>
              <th className="py-3.5 px-4">ESTADO</th>
              <th className="py-3.5 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 text-xs text-[#0840A8] dark:text-blue-50 font-medium">
            {paginatedCitas.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#0077D4] dark:text-blue-200/70 font-medium">
                  No se encontraron citas médicas registradas.
                </td>
              </tr>
            ) : (
              paginatedCitas.map((cita) => {
                return (
                  <tr
                    key={cita.id}
                    className="bg-white dark:bg-[#002D5E] even:bg-[#002247]/60 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors duration-200"
                  >
                    {/* Nº CITA */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs text-[#0077D4] dark:text-[#00C2E0]">
                        {cita.numero_cita}
                      </span>
                    </td>

                    {/* PACIENTE */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                        <div>
                          <div className="font-bold text-[#0840A8] dark:text-white text-xs">
                            {cita.paciente
                              ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                              : cita.nombre_paciente_unregistered || 'Sin paciente'}
                          </div>
                          <div className="text-[10px] font-mono">
                            {cita.paciente ? (
                              <span className="text-[#0077D4] dark:text-blue-200/70">{cita.paciente.codigo_paciente}</span>
                            ) : (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                                No registrado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SUCURSAL */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077D4] dark:text-blue-100">
                        <Building size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                        {cita.sucursal ? cita.sucursal.nombre || cita.sucursal.ubicacion : 'Sin sucursal'}
                      </span>
                    </td>

                    {/* FECHA / HORA */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[#0840A8] dark:text-white font-semibold text-xs">
                          <Calendar size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                          <span>{cita.fecha ? String(cita.fecha).split('T')[0] : '-'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#0077D4] dark:text-blue-200/80 font-mono">
                          <Clock size={11} className="text-[#0077D4] dark:text-[#00C2E0]" />
                          <span>{cita.hora_inicio?.substring(0, 5)} - {cita.hora_fin?.substring(0, 5)}</span>
                        </div>
                      </div>
                    </td>

                    {/* ESTADO */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(cita.estado)}
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onOpenBoleta && (
                          <button
                            onClick={() => onOpenBoleta(cita)}
                            title={cita.boletaServicioPrestado ? `Ver Boleta Nº ${cita.boletaServicioPrestado.numero_boleta}` : "Emitir Boleta de Servicios / Venta"}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              cita.boletaServicioPrestado
                                ? 'bg-[#00C2E0]/20 hover:bg-[#00C2E0]/30 text-[#0077D4] dark:text-[#00C2E0] border-[#0840A8]/15 dark:border-[#00C2E0]/40'
                                : 'bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-blue-200 border-[#0840A8]/15 dark:border-[#0077D4]/40'
                            }`}
                          >
                            <Receipt size={14} />
                          </button>
                        )}
                        {onViewDetails && (
                          <button
                            onClick={() => onViewDetails(cita)}
                            title="Ver cita completa"
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(cita)}
                          title="Editar / Cambiar estado"
                          className="p-1.5 rounded-lg bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 transition-colors cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(cita)}
                          title="Eliminar cita"
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
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

      {/* FOOTER PAGINATION */}
      <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-white dark:bg-[#0840A8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0077D4] dark:text-blue-200/80">
        <div>
          Mostrando <strong>{filteredCitas.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredCitas.length}</strong> citas
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1.5 rounded-lg border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                safeCurrentPage === p
                  ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30'
                  : 'bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0077D4] dark:text-blue-100 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
