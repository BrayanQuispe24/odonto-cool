import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Phone, UserCheck, Filter, Building, ClipboardList, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import type { Paciente } from '../types/patient';
import type { Sucursal } from '../../sucursales/types/sucursal';
import { getSucursalesApi } from '../../sucursales/services/sucursalService';

interface PatientListPanelProps {
  patients: Paciente[];
  selectedPatientId: number | null;
  onSelectPatient: (patient: Paciente) => void;
  onOpenCreateModal: () => void;
}

export const PatientListPanel: React.FC<PatientListPanelProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onOpenCreateModal,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedSucursal, setSelectedSucursal] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null && s !== searchTerm) {
      setSearchTerm(s);
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (val) p.set('search', val);
      else p.delete('search');
      return p;
    }, { replace: true });
  };
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    getSucursalesApi()
      .then((list) => setSucursales(list))
      .catch((err) => console.error('Error al cargar sucursales en pacientes:', err));
  }, []);

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${p.nombre} ${p.apellido}`.toLowerCase();
    const code = (p.codigo_paciente || '').toLowerCase();
    const phone = (p.celular || '').toLowerCase();
    const matchesSearch = fullName.includes(term) || code.includes(term) || phone.includes(term);

    const matchesSucursal =
      selectedSucursal === 'all' ||
      (selectedSucursal === 'none' && !p.sucursal_id) ||
      (p.sucursal_id ? String(p.sucursal_id) === selectedSucursal : false);

    return matchesSearch && matchesSucursal;
  });

  const getInitials = (name: string, lastName: string) => {
    const n = name ? name.charAt(0).toUpperCase() : 'P';
    const l = lastName ? lastName.charAt(0).toUpperCase() : 'A';
    return `${n}${l}`;
  };

  return (
    <div className="w-full flex flex-col bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden shrink-0 min-h-[60vh]">
      {/* Search & Filter Header */}
      <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg shrink-0">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h3 className="font-bold text-sm text-primary-dark dark:text-white flex items-center gap-1.5 shrink-0">
            <UserCheck size={16} className="text-primary dark:text-secondary" />
            <span>Pacientes ({filteredPatients.length})</span>
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto xl:justify-end">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 xl:w-72 shrink-0">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por nombre, DNI o código..."
                className="w-full pl-7 pr-3 py-1 rounded text-small border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Search size={13} className="absolute left-2.5 top-1.5 text-slate-400 dark:text-slate-500" />
            </div>

            {/* Sucursal Filter Dropdown */}
            <div className="flex items-center gap-1.5 w-full sm:w-56 shrink-0">
              <Filter size={13} className="text-primary dark:text-secondary shrink-0" />
              <select
                value={selectedSucursal}
                onChange={(e) => setSelectedSucursal(e.target.value)}
                className="w-full px-2 py-1 rounded text-small font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">Todas las sucursales</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">
                    {s.nombre || s.ubicacion} ({s.codigo_sucursal})
                  </option>
                ))}
                <option value="none" className="bg-white dark:bg-dark-surface text-primary-dark dark:text-white">Sin sucursal asignada</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <div className="flex bg-light-accent dark:bg-dark-surface rounded-lg p-0.5 border border-primary-dark/10 dark:border-secondary/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#0840A8] text-primary dark:text-secondary shadow-sm' : 'text-slate-400 dark:text-slate-400 hover:text-primary-dark dark:hover:text-white'}`}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid size={13} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-[#0840A8] text-primary dark:text-secondary shadow-sm' : 'text-slate-400 dark:text-slate-400 hover:text-primary-dark dark:hover:text-white'}`}
                  title="Vista Tabla"
                >
                  <List size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Items List (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto min-h-[200px] scroll-smooth">
        {filteredPatients.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0077D4]/10 dark:bg-[#00C2E0]/10 flex items-center justify-center mx-auto mb-4">
              <UserCheck size={24} className="text-primary dark:text-secondary" />
            </div>
            <p className="text-sm text-primary dark:text-secondary font-medium">
              No se encontraron pacientes que coincidan.
            </p>
            <p className="text-xs text-primary/70 dark:text-secondary/70 mt-1">
              Intenta con otro término de búsqueda o crea un nuevo paciente.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatientId;
              const initials = getInitials(patient.nombre, patient.apellido);

              return (
                <div
                  key={patient.id}
                  className={`relative group flex flex-col p-4 rounded-2xl border transition-all duration-300 ${isSelected
                      ? 'bg-gradient-to-br from-[#E5F7FF] to-white dark:from-[#001C3D] dark:to-[#0840A8]/20 border-primary dark:border-secondary shadow-md shadow-[#0077D4]/10'
                      : 'bg-white dark:bg-dark-surface border-primary-dark/10 dark:border-secondary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-[#0840A8]/5'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl font-bold text-sm flex items-center justify-center shrink-0 border ${isSelected
                          ? 'bg-[#0077D4] text-white border-secondary shadow-sm'
                          : 'bg-light-surface dark:bg-[#0840A8]/40 text-primary-dark dark:text-white border-primary-dark/15 dark:border-secondary/30 group-hover:bg-light-accent group-hover:text-primary'
                        } transition-colors`}
                    >
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex flex-col gap-1">
                        <h4
                          className={`text-sm font-extrabold truncate ${isSelected
                              ? 'text-primary-dark dark:text-white'
                              : 'text-[#002D5E] dark:text-slate-100 group-hover:text-primary'
                            } transition-colors`}
                        >
                          {patient.nombre} {patient.apellido}
                        </h4>
                        <span className="self-start text-micro font-mono font-bold px-2 py-0.5 rounded-full bg-light-surface dark:bg-[#0840A8]/60 text-primary dark:text-secondary border border-primary-dark/15 dark:border-secondary/30">
                          {patient.codigo_paciente}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-small text-slate-500 dark:text-teal-100/70">
                      <span className="font-medium bg-slate-100 dark:bg-[#0840A8]/40 px-2 py-0.5 rounded-md text-slate-600 dark:text-teal-100">{patient.edad} años</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono truncate bg-slate-50 dark:bg-transparent px-1 rounded">
                        <Phone size={10} className="text-teal-500 dark:text-teal-400 shrink-0" />
                        {patient.celular || 'Sin celular'}
                      </span>
                    </div>

                    {patient.sucursal && (
                      <div className="flex items-center gap-1.5 text-tiny font-semibold text-primary-dark/70 dark:text-secondary/80 bg-light-accent/50 dark:bg-dark-bg/50 p-1.5 rounded-lg border border-primary-dark/5 dark:border-secondary/10 truncate">
                        <Building size={11} className="shrink-0 text-primary dark:text-secondary" />
                        {patient.sucursal.nombre || patient.sucursal.ubicacion}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-primary-dark/30">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${isSelected
                          ? 'bg-[#0077D4] text-white shadow-md shadow-[#0077D4]/20 hover:bg-[#0840A8]'
                          : 'bg-light-surface dark:bg-[#0840A8]/30 text-primary dark:text-secondary hover:bg-light-accent dark:hover:bg-[#0840A8]/60 hover:shadow-sm'
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ClipboardList size={14} />
                        <span>Ver Historia Clínica</span>
                      </div>
                      <ChevronRight size={14} className={isSelected ? 'text-white/80' : 'text-primary/60 dark:text-secondary/60'} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-dark-bg text-primary-dark dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-2 font-semibold uppercase tracking-wider">Paciente</th>
                  <th className="px-4 py-2 font-semibold uppercase tracking-wider">Código</th>
                  <th className="px-4 py-2 font-semibold uppercase tracking-wider">Contacto</th>
                  <th className="px-4 py-2 font-semibold uppercase tracking-wider">Sucursal</th>
                  <th className="px-4 py-2 font-semibold uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-dark/10 dark:divide-secondary/10">
                {filteredPatients.map((patient) => {
                  const isSelected = patient.id === selectedPatientId;
                  const initials = getInitials(patient.nombre, patient.apellido);

                  return (
                    <tr 
                      key={patient.id} 
                      className={`transition-colors hover:bg-light-surface dark:hover:bg-[#0840A8]/20 ${isSelected ? 'bg-light-accent dark:bg-[#0840A8]/40' : 'bg-white dark:bg-dark-surface'}`}
                    >
                      <td className="px-4 py-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-micro shrink-0 ${isSelected ? 'bg-[#0077D4] text-white' : 'bg-slate-100 dark:bg-dark-bg text-primary-dark dark:text-slate-300'}`}>
                            {initials}
                          </div>
                          <div>
                            <div className={`font-semibold ${isSelected ? 'text-primary dark:text-secondary' : 'text-primary-dark dark:text-white'}`}>
                              {patient.nombre} {patient.apellido}
                            </div>
                            <div className="text-tiny text-slate-500 dark:text-slate-400">{patient.edad} años</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-1.5 font-mono text-slate-600 dark:text-slate-300">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {patient.codigo_paciente || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-1.5 font-mono text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <Phone size={11} className="text-slate-400" />
                          {patient.celular || 'Sin celular'}
                        </div>
                      </td>
                      <td className="px-4 py-1.5 text-slate-600 dark:text-slate-300">
                        {patient.sucursal ? (
                          <div className="flex items-center gap-1 max-w-[150px] truncate">
                            <Building size={11} className="shrink-0 text-slate-400" />
                            <span className="truncate">{patient.sucursal.nombre || patient.sucursal.ubicacion}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-1.5 text-right">
                        <button
                          onClick={() => onSelectPatient(patient)}
                          className={`px-3 py-1 rounded transition-all inline-flex items-center gap-1 cursor-pointer ${isSelected
                            ? 'bg-[#0077D4] text-white border border-primary'
                            : 'bg-white dark:bg-dark-bg text-primary dark:text-secondary border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-dark-surface'
                          }`}
                        >
                          <ClipboardList size={11} />
                          <span className="font-semibold text-tiny">Historia</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Summary Counter */}
      <div className="p-3 border-t border-primary-dark/15 dark:border-secondary/30 bg-light-surface/50 dark:bg-[#0840A8]/20 text-small text-primary dark:text-blue-200/80 font-semibold flex items-center justify-between shrink-0">
        <span>Mostrando {filteredPatients.length} de {patients.length} pacientes</span>
      </div>
    </div>
  );
};
