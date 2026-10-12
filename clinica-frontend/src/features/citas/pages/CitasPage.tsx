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

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

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
    setActiveTab('form');
  };

  const handleSelectCitaEdit = (cita: Cita) => {
    setSelectedCita(cita);
    setActiveTab('form');
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
    setActiveTab('list');
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
    <div className="space-y-4">
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 bg-slate-50 dark:bg-dark-bg px-2 pt-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 text-small font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'list'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary'
          }`}
        >
          Listado de Citas
        </button>
        
        {isDoctorRole && (
          <button
            onClick={handleNewCitaClick}
            className={`px-4 py-2 text-small font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'form'
                ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                : 'border-transparent text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary'
            }`}
          >
            {selectedCita ? 'Editar Cita' : 'Registrar Nueva Cita'}
          </button>
        )}
      </div>

      {/* ROLE NOTICE IF NOT DOCTOR */}
      {!isDoctorRole && (
        <div className="p-3 rounded-sm bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold flex items-center gap-2">
          <ShieldAlert size={16} className="text-primary" />
          <span>
            <strong>Información de Seguridad:</strong> La creación de citas requiere inicio de sesión con una cuenta que tenga el rol <strong>Doctor</strong>. (Tu rol actual: {user?.rol?.nombre || 'Usuario'}).
          </span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-3 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-semibold flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN CONTENT: TABS */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Cargando agenda de citas médicas...
        </div>
      ) : (
        <div className="w-full">
          {activeTab === 'list' ? (
            <CitaTable
              citas={citas}
              onEdit={handleSelectCitaEdit}
              onDelete={handleOpenDeleteModal}
              onViewDetails={(cita) => setCitaToView(cita)}
              onOpenBoleta={handleOpenBoleta}
            />
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              {(!isDoctorRole && !selectedCita) ? (
                <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center h-[400px]">
                  <ShieldAlert size={40} className="text-primary mb-3 opacity-50" />
                  <h3 className="text-sm font-bold mb-1 uppercase tracking-wider">Creación Restringida</h3>
                  <p className="text-small text-slate-500 dark:text-slate-400">
                    Solo los usuarios con rol <strong>Doctor</strong> pueden registrar nuevas citas médicas.
                  </p>
                  <p className="text-tiny text-slate-400 dark:text-slate-500 mt-3 uppercase tracking-wider">
                    Selecciona una cita existente de la tabla para ver o editar sus detalles.
                  </p>
                </div>
              ) : (
                <CitaFormPanel
                  onSubmit={handleSubmitCita}
                  cita={selectedCita}
                  onCancelEdit={() => {
                    setSelectedCita(null);
                    setActiveTab('list');
                  }}
                />
              )}
            </div>
          )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-sm p-4 text-slate-700 dark:text-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-white">Eliminar Cita</h3>
                <p className="text-tiny text-slate-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar la cita{' '}
              <strong className="text-primary-dark dark:text-white font-bold">{citaToDelete.numero_cita}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCitaToDelete(null);
                }}
                className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-small font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-small font-bold shadow-sm transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


