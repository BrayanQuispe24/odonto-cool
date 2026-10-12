import React, { useState, useEffect } from 'react';
import { Stethoscope, UserPlus, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DoctorTable } from '../components/DoctorTable';
import { DoctorFormPanel } from '../components/DoctorFormPanel';
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

  // Navigation state
  const [mainTab, setMainTab] = useState<'list' | 'form' | 'detail'>('list');
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
    setMainTab('form');
  };

  const handleOpenEditModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsReadOnly(false);
    setMainTab('form');
  };

  const handleOpenViewModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsReadOnly(true);
    setMainTab('detail');
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
    setMainTab('list');
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


      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-sm bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      {mainTab !== 'detail' && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setMainTab('list')}
            className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
              mainTab === 'list'
                ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
            }`}
          >
            Listado de Doctores
          </button>
          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
                mainTab === 'form'
                  ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
              }`}
            >
              Registrar Nuevo Doctor
            </button>
          )}
        </div>
      )}

      {/* TABLE / CARDS CONTENT */}
      {mainTab === 'list' && (
        <div className="w-full animate-fade-in">
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
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
        </div>
      )}

      {/* FORM / DETAIL PANEL */}
      {(mainTab === 'form' || mainTab === 'detail') && (
        <div className="w-full lg:w-3/5 mx-auto animate-fade-in">
          <DoctorFormPanel
            onSubmit={handleSubmitDoctor}
            onCancel={() => setMainTab('list')}
            doctor={selectedDoctor}
            isReadOnly={isReadOnly}
          />
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && doctorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-md p-5 text-primary-dark dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-900/30">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-small font-bold text-primary-dark dark:text-white uppercase tracking-wider">Eliminar Doctor</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar al{' '}
              <strong className="text-primary-dark dark:text-white font-bold">
                Dr. {doctorToDelete.nombre} {doctorToDelete.apellido}
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDoctorToDelete(null);
                }}
                className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-small font-semibold shadow-sm cursor-pointer transition-colors"
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
