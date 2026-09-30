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
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#0840A8]/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 max-w-lg">
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
            placeholder="Buscar doctor por nombre, apellido o usuario..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
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

        {/* SUCURSAL FILTER */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#0077D4] dark:text-blue-200 font-semibold whitespace-nowrap">
            <Filter size={15} className="text-[#0077D4] dark:text-[#00C2E0]" />
            <span>Sucursal:</span>
          </div>
          <select
            value={selectedSucursal}
            onChange={(e) => {
              setSelectedSucursal(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all cursor-pointer min-w-[180px]"
          >
            <option value="all" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">
                {s.nombre || s.ubicacion} ({s.codigo_sucursal})
              </option>
            ))}
            <option value="none" className="bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white">Sin sucursal asignada</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E5F7FF] dark:bg-[#0840A8]/40 border-b border-[#0840A8]/15 dark:border-[#0840A8]/60 text-[11px] font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-blue-100 select-none">
              <th className="py-3.5 px-4">DOCTOR / USUARIO</th>
              <th className="py-3.5 px-4">ESPECIALIDADES</th>
              <th className="py-3.5 px-4">TELÉFONOS</th>
              <th className="py-3.5 px-4">SUCURSAL</th>
              <th className="py-3.5 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 text-xs text-[#0840A8] dark:text-blue-50 font-medium">
            {paginatedDoctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#0077D4] dark:text-blue-200/70 font-medium">
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
                    className="bg-white dark:bg-[#002D5E] even:bg-[#002247]/60 hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30 transition-colors duration-200"
                  >
                    {/* DOCTOR / USUARIO */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#0840A8]/15 dark:border-[#00C2E0]/40">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#0840A8] dark:text-white text-xs">
                            Dr. {doctor.nombre} {doctor.apellido}
                          </div>
                          <div className="text-[11px] text-[#0077D4] dark:text-blue-200/70 font-mono">
                            {doctor.usuario?.email || 'Sin usuario vinculado'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ESPECIALIDADES */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {specs.map((spec, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#0840A8]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40"
                          >
                            <Stethoscope size={10} className="text-[#0077D4] dark:text-[#00C2E0]" />
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* TELÉFONOS */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#0077D4] dark:text-blue-100 font-mono text-[11px]">
                        <Phone size={12} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                        <span>
                          {doctor.telefonos && doctor.telefonos.length > 0
                            ? doctor.telefonos.join(', ')
                            : 'No registrado'}
                        </span>
                      </div>
                    </td>

                    {/* SUCURSAL */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077D4] dark:text-blue-100">
                        <Building size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                        {doctor.sucursal
                          ? doctor.sucursal.nombre || doctor.sucursal.ubicacion
                          : 'Sin sucursal'}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => (onView ? onView(doctor) : onEdit?.(doctor))}
                          title="Ver detalle"
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(doctor)}
                            title="Editar doctor"
                            className="p-1.5 rounded-lg bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 transition-colors cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(doctor)}
                            title="Eliminar doctor"
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer"
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
      <div className="block md:hidden p-4 space-y-3">
        {paginatedDoctors.length === 0 ? (
          <div className="py-8 text-center text-[#0077D4] dark:text-blue-200/70 text-xs font-medium">
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
                className="p-4 rounded-xl border bg-[#F4F9FF] dark:bg-[#001C3D] border-[#0840A8]/15 dark:border-[#0077D4]/40 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0077D4]/30 text-[#0077D4] dark:text-[#00C2E0] font-extrabold text-sm flex items-center justify-center shrink-0 border border-[#0840A8]/15 dark:border-[#00C2E0]/40">
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0840A8] dark:text-white text-sm">
                      Dr. {doctor.nombre} {doctor.apellido}
                    </h4>
                    <p className="text-xs text-[#0077D4] dark:text-blue-200/70 font-mono">
                      {doctor.usuario?.email || 'Sin usuario'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {specs.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#0840A8]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40"
                    >
                      <Stethoscope size={10} className="text-[#0077D4] dark:text-[#00C2E0]" />
                      {spec}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#002D5E] text-[#0077D4] dark:text-blue-100 border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                    <Building size={10} className="text-[#0077D4] dark:text-[#00C2E0]" />
                    {doctor.sucursal ? doctor.sucursal.nombre || doctor.sucursal.ubicacion : 'Sin sucursal'}
                  </span>
                </div>

                <div className={`grid gap-1.5 pt-3 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 ${onEdit && onDelete ? 'grid-cols-3' : 'grid-cols-1'}`}>
                  <button
                    onClick={() => (onView ? onView(doctor) : onEdit?.(doctor))}
                    className="w-full py-1.5 px-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap overflow-hidden"
                  >
                    <Eye size={13} className="shrink-0 text-[#0077D4] dark:text-[#00C2E0]" />
                    <span className="truncate">Ver</span>
                  </button>

                  {onEdit && (
                    <button
                      onClick={() => onEdit(doctor)}
                      className="w-full py-1.5 px-1 rounded-lg bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap overflow-hidden"
                    >
                      <Edit2 size={13} className="shrink-0" />
                      <span className="truncate">Editar</span>
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => onDelete(doctor)}
                      className="w-full py-1.5 px-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap overflow-hidden"
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
      <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#0840A8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0077D4] dark:text-blue-200/80">
        <div>
          Mostrando <strong>{filteredDoctors.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredDoctors.length}</strong> doctores
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
