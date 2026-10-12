import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { Servicio, ServicioFormData } from '../types/servicio';
import {
  getServiciosApi,
  createServicioApi,
  updateServicioApi,
  deleteServicioApi,
} from '../services/servicioService';
import { ServicioTable } from '../components/ServicioTable';
import { ServicioFormPanel } from '../components/ServicioFormPanel';
import { useAuthStore } from '../../auth/store/authStore';

export const ServiciosPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [servicioToDelete, setServicioToDelete] = useState<Servicio | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchServicios = async () => {
    setLoadingServicios(true);
    try {
      const data = await getServiciosApi();
      setServicios(data);
      setError(null);
    } catch {
      setError('Error al cargar la lista de servicios y precios.');
    } finally {
      setLoadingServicios(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleCreateOrUpdateServicio = async (formData: ServicioFormData) => {
    try {
      if (selectedServicio) {
        await updateServicioApi(selectedServicio.id, formData);
        showNotification('Servicio y precio actualizado correctamente.');
      } else {
        await createServicioApi(formData);
        showNotification('Nuevo servicio dental registrado exitosamente.');
      }
      setSelectedServicio(null);
      setActiveTab('list');
      fetchServicios();
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteServicio = async () => {
    if (!servicioToDelete) return;
    try {
      await deleteServicioApi(servicioToDelete.id);
      showNotification('Servicio dental eliminado correctamente.');
      if (selectedServicio?.id === servicioToDelete.id) {
        setSelectedServicio(null);
        if (activeTab === 'form') setActiveTab('list');
      }
      setServicioToDelete(null);
      fetchServicios();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al eliminar el servicio dental.');
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 text-small font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'list'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary'
          }`}
        >
          Catálogo de Servicios
        </button>

        {isAdmin && (
          <button
            onClick={() => {
              if (!selectedServicio) {
                 setSelectedServicio(null);
              }
              setActiveTab('form');
            }}
            className={`px-4 py-2 text-small font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'form'
                ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                : 'border-transparent text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary'
            }`}
          >
            {selectedServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
          </button>
        )}
      </div>

      {/* ROLE NOTICE IF NOT ADMIN */}
      {!isAdmin && (
        <div className="p-3 rounded-sm bg-slate-100 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold flex items-center gap-2">
          <ShieldAlert size={16} className="text-primary" />
          <span>
            <strong>Información de Seguridad:</strong> La creación y modificación de servicios requiere permisos de <strong>Administrador</strong>.
          </span>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {successMsg && (
        <div className="p-3 rounded-sm bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-primary dark:text-secondary text-small font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-small font-bold flex items-center gap-2 shadow-sm">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* CONTENT */}
      {loadingServicios ? (
        <div className="py-12 text-center text-small font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-2">
          <Sparkles className="animate-spin text-primary" size={20} />
          <span>Cargando catálogo de servicios y precios...</span>
        </div>
      ) : (
        <div className="w-full">
          {activeTab === 'list' ? (
            <ServicioTable
              servicios={servicios}
              onEdit={(serv) => {
                if (isAdmin) {
                  setSelectedServicio(serv);
                  setActiveTab('form');
                }
              }}
              onDelete={(serv) => {
                if (isAdmin) setServicioToDelete(serv);
              }}
            />
          ) : (
            <div className="max-w-4xl mx-auto">
              {!isAdmin && !selectedServicio ? (
                <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center h-[400px]">
                  <ShieldAlert size={40} className="text-primary mb-3 opacity-50" />
                  <h3 className="text-sm font-bold mb-1 uppercase tracking-wider">Creación Restringida</h3>
                  <p className="text-small text-slate-500 dark:text-slate-400">
                    Solo los usuarios con rol <strong>Administrador</strong> pueden registrar nuevos servicios.
                  </p>
                </div>
              ) : (
                <ServicioFormPanel
                  onSubmit={handleCreateOrUpdateServicio}
                  servicio={selectedServicio}
                  onCancelEdit={() => {
                    setSelectedServicio(null);
                    setActiveTab('list');
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {servicioToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl p-4 w-full max-w-sm text-slate-700 dark:text-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle size={20} />
              <span>Confirmar Eliminación</span>
            </div>
            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar el servicio{' '}
              <strong className="text-primary-dark dark:text-white">"{servicioToDelete.nombre}"</strong> ({servicioToDelete.codigo_servicio})? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setServicioToDelete(null)}
                className="px-3 py-1.5 rounded bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteServicio}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-small font-bold shadow-sm transition-colors"
              >
                Eliminar Servicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
