import React, { useState, useEffect } from 'react';
import { Stethoscope, UserPlus, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DoctorTable } from '../components/DoctorTable';
import { DoctorFormModal } from '../components/DoctorFormModal';
import type { Doctor, DoctorFormData } from '../types/doctor';
import {
  getDoctoresApi,
  createDoctorApi,
  updateDoctorApi,
  deleteDoctorApi,
} from '../services/doctorService';
import { useUserRole } from '../../../hooks/useUserRole';

export const DoctorsPage: React.FC = () => {
  const { isAdmin } = useUserRole();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctoresApi();
      setDoctors(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar el listado de doctores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedDoctor(null);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsReadOnly(true);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (doctor: Doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitDoctor = async (formData: DoctorFormData) => {
    if (selectedDoctor) {
      await updateDoctorApi(selectedDoctor.id, formData);
      toast.success(`Doctor Dr. ${formData.nombre} ${formData.apellido} actualizado`);
    } else {
      await createDoctorApi(formData);
      toast.success(`Doctor Dr. ${formData.nombre} ${formData.apellido} registrado exitosamente`);
    }
    await fetchDoctors();
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    try {
      await deleteDoctorApi(doctorToDelete.id);
      setIsDeleteModalOpen(false);
      toast.info(`Doctor Dr. ${doctorToDelete.nombre} ${doctorToDelete.apellido} eliminado`);
      setDoctorToDelete(null);
      await fetchDoctors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar el doctor');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-sm dark:shadow-[#001C3D]/50">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0840A8] dark:text-white flex items-center gap-2">
            <Stethoscope className="text-[#0077D4] dark:text-[#00C2E0]" size={26} />
            Gestión de Doctores
          </h1>
          <p className="text-xs text-[#0077D4] dark:text-blue-200/80 mt-1">
            Administra el personal médico, especialidades odontológicas y vinculación de usuarios.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 cursor-pointer transition-all flex items-center gap-2 shrink-0"
          >
            <UserPlus size={16} />
            <span>Registrar Doctor</span>
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* TABLE / CARDS CONTENT */}
      {loading ? (
        <div className="p-12 text-center text-[#0077D4] dark:text-blue-200/80 text-sm font-medium">
          Cargando listado de doctores...
        </div>
      ) : (
        <DoctorTable
          doctors={doctors}
          onView={handleOpenViewModal}
          onEdit={isAdmin ? handleOpenEditModal : undefined}
          onDelete={isAdmin ? handleOpenDeleteModal : undefined}
        />
      )}

      {/* FORM MODAL */}
      <DoctorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitDoctor}
        doctor={selectedDoctor}
        isReadOnly={isReadOnly}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && doctorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-rose-500/40 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-md p-6 text-[#0840A8] dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0840A8] dark:text-white">Eliminar Doctor</h3>
                <p className="text-xs text-[#0077D4] dark:text-blue-200/70">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-xs text-[#0077D4] dark:text-blue-100">
              ¿Estás seguro de que deseas eliminar al{' '}
              <strong className="text-[#0840A8] dark:text-white font-bold">
                Dr. {doctorToDelete.nombre} {doctorToDelete.apellido}
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDoctorToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-[#0840A8] dark:text-white text-xs font-bold shadow-md shadow-rose-900/50 cursor-pointer transition-all"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
