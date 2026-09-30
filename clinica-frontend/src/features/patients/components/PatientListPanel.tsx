import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Phone, UserCheck, Filter, Building } from 'lucide-react';
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
    <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-xs overflow-hidden shrink-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-120px)]">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30 bg-[#F4F9FF]/70 dark:bg-[#0840A8]/30 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#0840A8] dark:text-white flex items-center gap-1.5">
            <UserCheck size={16} className="text-[#0077D4] dark:text-[#00C2E0]" />
            <span>Pacientes ({filteredPatients.length})</span>
          </h3>
          <button
            onClick={onOpenCreateModal}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <UserPlus size={13} />
            <span>Nuevo</span>
          </button>
        </div>

        <div className="space-y-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre, DNI o código..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/40 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder-[#0077D4]/60 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#0077D4] dark:text-[#00C2E0]" />
          </div>

          {/* Sucursal Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
            <select
              value={selectedSucursal}
              onChange={(e) => setSelectedSucursal(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/40 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50 cursor-pointer"
            >
              <option value="all" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Todas las sucursales</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                  {s.nombre || s.ubicacion} ({s.codigo_sucursal})
                </option>
              ))}
              <option value="none" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">Sin sucursal asignada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Items List (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#00C2E0]/15 max-h-[500px] lg:max-h-[calc(100vh-260px)] min-h-[200px] scroll-smooth">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#0077D4] dark:text-[#00C2E0] font-medium">
            No se encontraron pacientes que coincidan.
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const isSelected = patient.id === selectedPatientId;
            const initials = getInitials(patient.nombre, patient.apellido);

            return (
              <button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className={`w-full p-3.5 text-left transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#E5F7FF] dark:bg-[#0840A8]/50 border-l-4 border-[#0077D4] dark:border-[#00C2E0]'
                    : 'hover:bg-[#F4F9FF] dark:hover:bg-[#0840A8]/20 bg-transparent'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border shadow-2xs ${
                    isSelected
                      ? 'bg-[#0077D4] text-white border-[#00C2E0]'
                      : 'bg-[#E5F7FF] dark:bg-[#0840A8]/40 text-[#0840A8] dark:text-white border-[#0840A8]/15 dark:border-[#00C2E0]/30'
                  }`}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs font-bold truncate ${
                        isSelected
                          ? 'text-[#0840A8] dark:text-white'
                          : 'text-[#002D5E] dark:text-slate-100'
                      }`}
                    >
                      {patient.nombre} {patient.apellido}
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E5F7FF] dark:bg-[#0840A8]/60 text-[#0840A8] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shrink-0">
                      {patient.codigo_paciente}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-teal-200/70 flex-wrap">
                    <span>{patient.edad} años</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono truncate">
                      <Phone size={10} className="text-teal-400 shrink-0" />
                      {patient.celular || 'Sin celular'}
                    </span>
                    {patient.sucursal && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-[#0077D4] dark:text-[#00C2E0] truncate max-w-[120px]">
                          <Building size={10} className="shrink-0" />
                          {patient.sucursal.nombre || patient.sucursal.ubicacion}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Summary Counter */}
      <div className="p-3 border-t border-[#0840A8]/15 dark:border-[#00C2E0]/30 bg-[#F4F9FF]/50 dark:bg-[#0840A8]/20 text-[11px] text-[#0077D4] dark:text-blue-200/80 font-semibold flex items-center justify-between shrink-0">
        <span>Mostrando {filteredPatients.length} de {patients.length} pacientes</span>
      </div>
    </div>
  );
};
