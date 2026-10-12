import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Stethoscope,
  Building,
  Filter,
} from 'lucide-react';
import type { Doctor } from '../types/doctor';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';

interface DoctorTableProps {
  doctors: Doctor[];
  onView?: (doctor: Doctor) => void;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (doctor: Doctor) => void;
}

export const DoctorTable: React.FC<DoctorTableProps> = ({
  doctors,
  onView,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState<string>('all');
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const data = await getSucursalesApi();
        setSucursales(data);
      } catch (e) {
        console.error('Error al cargar sucursales para filtro:', e);
      }
    };
    fetchSucursales();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const fullName = `${doc.nombre} ${doc.apellido}`.toLowerCase();
      const email = doc.usuario?.email?.toLowerCase() || '';
      const term = searchTerm.toLowerCase();
      const matchesSearch = fullName.includes(term) || email.includes(term);

      const matchesSucursal =
        selectedSucursal === 'all' ||
        (selectedSucursal === 'none' && !doc.sucursal_id) ||
        (doc.sucursal_id ? String(doc.sucursal_id) === selectedSucursal : false);

      return matchesSearch && matchesSucursal;
    });
  }, [doctors, searchTerm, selectedSucursal]);

  const totalPages = Math.ceil(filteredDoctors.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDoctors = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, safeCurrentPage, pageSize]);

  const getInitials = (name: string, lastName: string) => {
    const n = name ? name.charAt(0).toUpperCase() : 'D';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'R';
    return `${n}${l}`;
  };

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredDoctors.length);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar doctor por nombre, apellido o usuario..."
            className="w-full pl-9 pr-8 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* SUCURSAL FILTER */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">
            <Filter size={14} />
            <span>Sucursal:</span>
          </div>
          <select
            value={selectedSucursal}
            onChange={(e) => {
              setSelectedSucursal(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer min-w-[180px]"
          >
            <option value="all">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre || s.ubicacion} ({s.codigo_sucursal})
              </option>
            ))}
            <option value="none">Sin sucursal asignada</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
              <th className="py-3 px-4">DOCTOR / USUARIO</th>
              <th className="py-3 px-4">ESPECIALIDADES</th>
              <th className="py-3 px-4">TELÉFONOS</th>
              <th className="py-3 px-4">SUCURSAL</th>
              <th className="py-3 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
            {paginatedDoctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                  No se encontraron doctores registrados.
                </td>
              </tr>
            ) : (
              paginatedDoctors.map((doctor) => {
                const initials = getInitials(doctor.nombre, doctor.apellido);
                const specs = doctor.especialidades && doctor.especialidades.length > 0
                  ? doctor.especialidades
                  : ['General'];

                return (
                  <tr
                    key={doctor.id}
                    className="bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors duration-200"
                  >
                    {/* DOCTOR / USUARIO */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-primary-dark dark:text-white text-small">
                            Dr. {doctor.nombre} {doctor.apellido}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {doctor.usuario?.email || 'Sin usuario vinculado'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ESPECIALIDADES */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {specs.map((spec, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            <Stethoscope size={10} className="text-primary dark:text-secondary" />
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* TELÉFONOS */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        <Phone size={12} className="text-primary dark:text-secondary shrink-0" />
                        <span>
                          {doctor.telefonos && doctor.telefonos.length > 0
                            ? doctor.telefonos.join(', ')
                            : 'No registrado'}
                        </span>
                      </div>
                    </td>

                    {/* SUCURSAL */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Building size={12} className="text-primary dark:text-secondary" />
                        {doctor.sucursal
                          ? doctor.sucursal.nombre || doctor.sucursal.ubicacion
                          : 'Sin sucursal'}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => (onView ? onView(doctor) : onEdit?.(doctor))}
                          title="Ver detalle"
                          className="p-1.5 rounded-sm text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(doctor)}
                            title="Editar doctor"
                            className="p-1.5 rounded-sm text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(doctor)}
                            title="Eliminar doctor"
                            className="p-1.5 rounded-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="block md:hidden p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
        {paginatedDoctors.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-medium">
            No se encontraron doctores registrados.
          </div>
        ) : (
          paginatedDoctors.map((doctor) => {
            const initials = getInitials(doctor.nombre, doctor.apellido);
            const specs = doctor.especialidades && doctor.especialidades.length > 0
              ? doctor.especialidades
              : ['General'];

            return (
              <div
                key={doctor.id}
                className="p-4 rounded-sm border bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-dark dark:text-white text-sm">
                      Dr. {doctor.nombre} {doctor.apellido}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {doctor.usuario?.email || 'Sin usuario'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {specs.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      <Stethoscope size={10} className="text-primary dark:text-secondary" />
                      {spec}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <Building size={10} className="text-primary dark:text-secondary" />
                    {doctor.sucursal ? doctor.sucursal.nombre || doctor.sucursal.ubicacion : 'Sin sucursal'}
                  </span>
                </div>

                <div className={`grid gap-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 ${onEdit && onDelete ? 'grid-cols-3' : 'grid-cols-1'}`}>
                  <button
                    onClick={() => (onView ? onView(doctor) : onEdit?.(doctor))}
                    className="w-full py-1.5 px-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye size={13} className="shrink-0 text-slate-500" />
                    <span className="truncate">Ver</span>
                  </button>

                  {onEdit && (
                    <button
                      onClick={() => onEdit(doctor)}
                      className="w-full py-1.5 px-1 rounded-sm border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:bg-emerald-100 transition-colors"
                    >
                      <Edit2 size={13} className="shrink-0" />
                      <span className="truncate">Editar</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(doctor)}
                      className="w-full py-1.5 px-1 rounded-sm border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={13} className="shrink-0" />
                      <span className="truncate">Eliminar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER PAGINATION */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Mostrando <strong>{filteredDoctors.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredDoctors.length}</strong> doctores
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`min-w-[28px] h-7 px-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                safeCurrentPage === p
                  ? 'bg-[#0077D4] text-white'
                  : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
