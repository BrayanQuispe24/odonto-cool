import React, { useState, useEffect } from 'react';
import { X, UserPlus, Stethoscope, Building2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { getDoctoresApi } from '../../doctors/services/doctorService';
import type { Doctor } from '../../doctors/types/doctor';
import type { Sucursal } from '../types/sucursal';

interface AssignDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (doctorId: number) => Promise<void>;
  sucursal: Sucursal | null;
}

export const AssignDoctorModal: React.FC<AssignDoctorModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  sucursal,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFetchingDoctors(true);
      getDoctoresApi()
        .then((data) => {
          setDoctors(data);
          if (data.length > 0) {
            setSelectedDoctorId(data[0].id);
          }
        })
        .catch(() => {
          setError('Error al cargar la lista de doctores.');
        })
        .finally(() => {
          setFetchingDoctors(false);
        });
    }
  }, [isOpen]);

  if (!isOpen || !sucursal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setError('Por favor selecciona un doctor.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onAssign(Number(selectedDoctorId));
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al asignar el doctor a la sucursal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-[#0840A8] dark:text-white space-y-0">
        {/* Header */}
        <div className="p-5 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30 flex items-center justify-between bg-[#F4F9FF]/80 dark:bg-[#0840A8]/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0077D4]/15 dark:bg-[#00C2E0]/20 text-[#0077D4] dark:text-[#00C2E0]">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Asignar Doctor a Sucursal
              </h3>
              <p className="text-xs font-mono text-[#0077D4] dark:text-[#00C2E0]">
                {sucursal.nombre} ({sucursal.codigo_sucursal})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {fetchingDoctors ? (
            <div className="p-6 text-center text-xs text-[#0077D4] dark:text-[#00C2E0]">
              Cargando médicos disponibles...
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold mb-1.5 flex items-center gap-1">
                <Stethoscope size={13} className="text-[#0077D4] dark:text-[#00C2E0]" />
                Seleccionar Especialista Médico *
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                required
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/40 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.nombre} {doc.apellido} — {doc.sucursal?.nombre || 'Sin Sucursal'}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#E5F7FF] dark:bg-[#0840A8]/30 border border-[#0840A8]/15 dark:border-[#0077D4]/20 text-xs text-[#0840A8] dark:text-cyan-100 flex items-start gap-2">
            <Building2 size={16} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0 mt-0.5" />
            <span>
              Al asignar el especialista a esta sucursal, sus consultas y citas agendadas quedarán vinculadas como tenant de <strong>{sucursal.nombre}</strong>.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#0840A8]/15 dark:border-[#00C2E0]/20">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button variant="teal" type="submit" disabled={loading || fetchingDoctors}>
              {loading ? 'Asignando...' : 'Asignar Doctor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
