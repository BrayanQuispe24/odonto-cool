import React, { useState, useEffect } from 'react';
import { Calendar, Plus, AlertCircle, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { CitaTable } from '../components/CitaTable';
import { CitaFormPanel } from '../components/CitaFormPanel';
import { CitaDetailsModal } from '../components/CitaDetailsModal';
import { BoletaCreateModal } from '../../boletas/components/BoletaCreateModal';
import { BoletaDetailsModal } from '../../boletas/components/BoletaDetailsModal';
import type { Cita, CitaFormData } from '../types/cita';
import type { BoletaServicioPrestado, BoletaFormData } from '../../boletas/types/boleta';
import {
  getCitasApi,
  createCitaApi,
  updateCitaApi,
  deleteCitaApi,
} from '../services/citaService';
import { createBoletaApi, getBoletasApi } from '../../boletas/services/boletaService';
import { useAuthStore } from '../../auth/store/authStore';

export const CitasPage: React.FC = () => {
  const { user } = useAuthStore();
  const isDoctorRole = user?.rol?.nombre === 'Doctor';

  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Cita for Form panel (null = new appointment)
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  // Details modal state
  const [citaToView, setCitaToView] = useState<Cita | null>(null);

  // Boleta creation and details modal state
  const [boletaCitaToCreate, setBoletaCitaToCreate] = useState<Cita | null>(null);
  const [boletaToViewDetails, setBoletaToViewDetails] = useState<BoletaServicioPrestado | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);

  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCitasApi();
      setCitas(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar las citas médicas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleNewCitaClick = () => {
    if (!isDoctorRole) {
      toast.error('Acceso denegado: Solo los usuarios con rol Doctor pueden registrar nuevas citas médicas.');
      return;
    }
    setSelectedCita(null);
    const panel = document.getElementById('cita-form-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSelectCitaEdit = (cita: Cita) => {
    setSelectedCita(cita);
    const panel = document.getElementById('cita-form-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleOpenDeleteModal = (cita: Cita) => {
    setCitaToDelete(cita);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCita = async (formData: CitaFormData) => {
    if (selectedCita) {
      await updateCitaApi(selectedCita.id, formData);
      toast.success(`Cita médica ${selectedCita.numero_cita} actualizada exitosamente`);
      setSelectedCita(null);
    } else {
      const newCita = await createCitaApi(formData);
      toast.success(`Cita médica ${newCita.numero_cita} registrada exitosamente`);
    }
    await fetchCitas();
  };

  const handleConfirmDelete = async () => {
    if (!citaToDelete) return;
    try {
      await deleteCitaApi(citaToDelete.id);
      setIsDeleteModalOpen(false);
      toast.info(`Cita ${citaToDelete.numero_cita} eliminada`);
      if (selectedCita?.id === citaToDelete.id) {
        setSelectedCita(null);
      }
      setCitaToDelete(null);
      await fetchCitas();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar la cita médica');
    }
  };

  const handleOpenBoleta = async (cita: Cita) => {
    if (cita.boletaServicioPrestado) {
      try {
        const list = await getBoletasApi({ cita_id: cita.id });
        if (list.length > 0) {
          setBoletaToViewDetails(list[0]);
        } else {
          setBoletaToViewDetails(cita.boletaServicioPrestado as any);
        }
      } catch {
        setBoletaToViewDetails(cita.boletaServicioPrestado as any);
      }
    } else {
      setBoletaCitaToCreate(cita);
    }
  };

  const handleCreateBoletaSubmit = async (formData: BoletaFormData) => {
    const newBoleta = await createBoletaApi(formData);
    toast.success(`Boleta de Servicios Nº ${newBoleta.numero_boleta} generada exitosamente`);
    setBoletaCitaToCreate(null);
    await fetchCitas();
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-sm dark:shadow-[#001C3D]/50">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0840A8] dark:text-white flex items-center gap-2">
            <Calendar className="text-[#0077D4] dark:text-[#00C2E0]" size={26} />
            Gestión de Citas Médicas
          </h1>
          <p className="text-xs text-[#0077D4] dark:text-blue-200/80 mt-1">
            Agenda odontológica multisucursal, asignación de doctores y seguimiento del estado de atención.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDoctorRole && (
            <button
              onClick={handleNewCitaClick}
              className="px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#0077D4]/30 cursor-pointer transition-all flex items-center gap-2 shrink-0 bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white"
            >
              <Plus size={16} />
              <span>Nueva Cita</span>
            </button>
          )}
        </div>
      </div>

      {/* ROLE NOTICE IF NOT DOCTOR */}
      {!isDoctorRole && (
        <div className="p-3.5 rounded-xl bg-[#E5F7FF] dark:bg-[#0840A8]/30 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0077D4] dark:text-blue-100 text-xs font-semibold flex items-center gap-2.5">
          <ShieldAlert size={18} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
          <span>
            <strong>Información de Seguridad:</strong> La creación de citas requiere inicio de sesión con una cuenta que tenga el rol <strong>Doctor</strong>. (Tu rol actual: {user?.rol?.nombre || 'Usuario'}).
          </span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN CONTENT GRID: LISTING (65%) + FORM (30%-35%) SIDE-BY-SIDE */}
      {loading ? (
        <div className="p-12 text-center text-[#0077D4] dark:text-blue-200/80 text-sm font-medium">
          Cargando agenda de citas médicas...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Appointment List Table (~65%) */}
          <div className="lg:col-span-8 xl:col-span-8">
            <CitaTable
              citas={citas}
              onEdit={handleSelectCitaEdit}
              onDelete={handleOpenDeleteModal}
              onViewDetails={(cita) => setCitaToView(cita)}
              onOpenBoleta={handleOpenBoleta}
            />
          </div>

          {/* Appointment Form Panel Side-by-Side (~30-35%) */}
          <div className="lg:col-span-4 xl:col-span-4">
            {(!isDoctorRole && !selectedCita) ? (
              <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 p-8 text-center text-[#0840A8] dark:text-white flex flex-col items-center justify-center sticky top-6 h-[400px]">
                <ShieldAlert size={48} className="text-[#0077D4] dark:text-[#00C2E0] mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">Creación Restringida</h3>
                <p className="text-sm text-[#0077D4] dark:text-blue-200/70">
                  Solo los usuarios con rol <strong>Doctor</strong> pueden registrar nuevas citas médicas.
                </p>
                <p className="text-xs text-[#0077D4] dark:text-blue-200/50 mt-4">
                  Selecciona una cita existente de la tabla para ver o editar sus detalles.
                </p>
              </div>
            ) : (
              <CitaFormPanel
                onSubmit={handleSubmitCita}
                cita={selectedCita}
                onCancelEdit={() => setSelectedCita(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* VIEW FULL DETAILS MODAL */}
      <CitaDetailsModal
        isOpen={!!citaToView}
        onClose={() => setCitaToView(null)}
        cita={citaToView}
        onEdit={handleSelectCitaEdit}
      />

      {/* CREATE BOLETA MODAL FOR CITA */}
      <BoletaCreateModal
        isOpen={!!boletaCitaToCreate}
        onClose={() => setBoletaCitaToCreate(null)}
        onSubmit={handleCreateBoletaSubmit}
        preselectedCita={boletaCitaToCreate}
      />

      {/* VIEW BOLETA DETAILS MODAL */}
      <BoletaDetailsModal
        isOpen={!!boletaToViewDetails}
        onClose={() => setBoletaToViewDetails(null)}
        boleta={boletaToViewDetails}
        onBoletaUpdated={(updated) => {
          setBoletaToViewDetails(updated);
          fetchCitas();
        }}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && citaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-rose-500/40 rounded-2xl shadow-2xl shadow-[#001C3D]/80 w-full max-w-md p-6 text-[#0840A8] dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0840A8] dark:text-white">Eliminar Cita Médica</h3>
                <p className="text-xs text-[#0077D4] dark:text-blue-200/70">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-xs text-[#0077D4] dark:text-blue-100">
              ¿Estás seguro de que deseas eliminar la cita{' '}
              <strong className="text-[#0840A8] dark:text-white font-bold">{citaToDelete.numero_cita}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCitaToDelete(null);
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


