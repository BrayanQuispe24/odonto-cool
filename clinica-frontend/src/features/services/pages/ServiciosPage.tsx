import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Sparkles, DollarSign, Tag, CheckCircle2, AlertTriangle, Layers, Activity, Hash } from 'lucide-react';
import type { Servicio, ServicioFormData } from '../types/servicio';
import type { Diente, DienteFormData } from '../../dientes/types/diente';
import {
  getServiciosApi,
  createServicioApi,
  updateServicioApi,
  deleteServicioApi,
} from '../services/servicioService';
import {
  getDientesApi,
  createDienteApi,
  updateDienteApi,
  deleteDienteApi,
} from '../../dientes/services/dienteService';

import { ServicioTable } from '../components/ServicioTable';
import { ServicioFormPanel } from '../components/ServicioFormPanel';
import { DienteTable } from '../../dientes/components/DienteTable';
import { DienteFormPanel } from '../../dientes/components/DienteFormPanel';
import { useAuthStore } from '../../auth/store/authStore';

export const ServiciosPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [activeTab, setActiveTab] = useState<'servicios' | 'dientes'>('servicios');

  // Servicios State
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [servicioToDelete, setServicioToDelete] = useState<Servicio | null>(null);

  // Dientes State
  const [dientes, setDientes] = useState<Diente[]>([]);
  const [loadingDientes, setLoadingDientes] = useState(true);
  const [selectedDiente, setSelectedDiente] = useState<Diente | null>(null);
  const [dienteToDelete, setDienteToDelete] = useState<Diente | null>(null);

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

  const fetchDientes = async () => {
    setLoadingDientes(true);
    try {
      const data = await getDientesApi();
      setDientes(data);
      setError(null);
    } catch {
      setError('Error al cargar el directorio de piezas dentales.');
    } finally {
      setLoadingDientes(false);
    }
  };

  useEffect(() => {
    fetchServicios();
    fetchDientes();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Handlers for Servicios
  const handleCreateOrUpdateServicio = async (formData: ServicioFormData) => {
    try {
      if (selectedServicio) {
        await updateServicioApi(selectedServicio.id, formData);
        showNotification('Servicio y precio actualizado correctamente.');
        setSelectedServicio(null);
      } else {
        await createServicioApi(formData);
        showNotification('Nuevo servicio dental registrado exitosamente.');
      }
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
      setServicioToDelete(null);
      if (selectedServicio?.id === servicioToDelete.id) {
        setSelectedServicio(null);
      }
      fetchServicios();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al eliminar el servicio dental.');
    }
  };

  // Handlers for Dientes
  const handleCreateOrUpdateDiente = async (formData: DienteFormData) => {
    try {
      if (selectedDiente) {
        await updateDienteApi(selectedDiente.id, formData);
        showNotification('Pieza dental actualizada correctamente.');
        setSelectedDiente(null);
      } else {
        await createDienteApi(formData);
        showNotification('Nueva pieza dental registrada exitosamente.');
      }
      fetchDientes();
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteDiente = async () => {
    if (!dienteToDelete) return;
    try {
      await deleteDienteApi(dienteToDelete.id);
      showNotification('Pieza dental eliminada correctamente.');
      setDienteToDelete(null);
      if (selectedDiente?.id === dienteToDelete.id) {
        setSelectedDiente(null);
      }
      fetchDientes();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al eliminar la pieza dental.');
    }
  };

  // Metrics for Servicios
  const totalServicios = servicios.length;
  const serviciosActivos = useMemo(() => servicios.filter((s) => s.estado).length, [servicios]);
  const categoriasUnicas = useMemo(() => new Set(servicios.map((s) => s.categoria).filter(Boolean)).size, [servicios]);
  const precioPromedio = useMemo(() => {
    if (servicios.length === 0) return 0;
    const total = servicios.reduce((acc, curr) => acc + Number(curr.precio || 0), 0);
    return total / servicios.length;
  }, [servicios]);

  // Metrics for Dientes
  const totalDientes = dientes.length;
  const dientesPermanentes = useMemo(() => dientes.filter((d) => d.tipo_denticion === 'permanente').length, [dientes]);
  const dientesDeciduos = useMemo(() => dientes.filter((d) => d.tipo_denticion === 'deciduo').length, [dientes]);
  const cuadrantesContador = useMemo(() => new Set(dientes.map((d) => d.cuadrante).filter(Boolean)).size, [dientes]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#002D5E] via-[#0840A8] to-[#0077D4] rounded-2xl p-6 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={16} />
            <span>Catálogo Clínico & Estándar Anatómico FDI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Servicios, Precios & Piezas Dentales
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 mt-1 max-w-xl font-medium">
            Gestión unificada del catálogo oficial de tarifas de tratamientos dentales y el directorio anatómico de piezas dentales por cuadrantes.
          </p>
        </div>

        {isAdmin && (
          <div>
            {activeTab === 'servicios' ? (
              <button
                onClick={() => {
                  setSelectedServicio(null);
                  const el = document.getElementById('servicio-nombre-input');
                  if (el) el.focus();
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00C2E0] to-[#0077D4] hover:from-[#0077D4] hover:to-[#0840A8] text-white text-xs font-bold shadow-lg shadow-[#00C2E0]/20 hover:shadow-[#00C2E0]/40 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-white/20"
              >
                <Plus size={16} />
                <span>Nuevo Servicio y Precio</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedDiente(null);
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00C2E0] to-[#0077D4] hover:from-[#0077D4] hover:to-[#0840A8] text-white text-xs font-bold shadow-lg shadow-[#00C2E0]/20 hover:shadow-[#00C2E0]/40 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-white/20"
              >
                <Plus size={16} />
                <span>Nueva Pieza Dental</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* NOTIFICATIONS */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-cyan-950/90 border border-[#0840A8]/15 dark:border-[#00C2E0]/50 text-[#0077D4] dark:text-[#00C2E0] text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-800/80 text-rose-200 text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <AlertTriangle size={18} className="text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* TABS NAVIGATION BAR */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
        <button
          onClick={() => {
            setActiveTab('servicios');
            setSelectedServicio(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'servicios'
              ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-lg shadow-[#0077D4]/40 ring-1 ring-white/20'
              : 'text-[#0077D4] dark:text-blue-200/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign size={16} />
          <span>Catálogo de Servicios & Precios ({totalServicios})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('dientes');
            setSelectedDiente(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'dientes'
              ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-lg shadow-[#0077D4]/40 ring-1 ring-white/20'
              : 'text-[#0077D4] dark:text-blue-200/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity size={16} />
          <span>Directorio de Piezas Dentales (FDI) ({totalDientes})</span>
        </button>
      </div>

      {/* METRICS CARDS */}
      {activeTab === 'servicios' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-[#0077D4] dark:text-[#00C2E0]">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Total Servicios</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{totalServicios}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Servicios Activos</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{serviciosActivos}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-[#0077D4] dark:text-[#00C2E0]">
              <Tag size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Categorías</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{categoriasUnicas}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-amber-600 dark:text-amber-300">
              <DollarSign size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Precio Promedio</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">Bs. {precioPromedio.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-[#0077D4] dark:text-[#00C2E0]">
              <Hash size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Total Piezas FDI</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{totalDientes}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-cyan-400">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Dentición Permanente</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{dientesPermanentes}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-amber-600 dark:text-amber-300">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Dentición Decidua</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{dientesDeciduos}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#002D5E] p-4 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/30 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#0077D4]/20 text-emerald-600 dark:text-emerald-400">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/80">Cuadrantes Mapeados</div>
              <div className="text-lg font-bold text-[#0840A8] dark:text-white font-mono">{cuadrantesContador}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT (SIDE BY SIDE LAYOUT FOR ADMIN, FULL WIDTH TABLE FOR NON-ADMIN) */}
      {activeTab === 'servicios' ? (
        loadingServicios ? (
          <div className="py-16 text-center text-xs font-semibold text-[#0077D4] dark:text-[#00C2E0] flex flex-col items-center justify-center gap-2">
            <Sparkles className="animate-spin text-[#0077D4] dark:text-[#00C2E0]" size={24} />
            <span>Cargando catálogo de servicios y precios...</span>
          </div>
        ) : isAdmin ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-7">
              <ServicioTable
                servicios={servicios}
                onEdit={(serv) => {
                  setSelectedServicio(serv);
                  window.scrollTo({ top: 250, behavior: 'smooth' });
                }}
                onDelete={(serv) => {
                  setServicioToDelete(serv);
                }}
              />
            </div>

            <div className="lg:col-span-5 xl:col-span-5">
              <ServicioFormPanel
                onSubmit={handleCreateOrUpdateServicio}
                servicio={selectedServicio}
                onCancelEdit={() => setSelectedServicio(null)}
              />
            </div>
          </div>
        ) : (
          <ServicioTable
            servicios={servicios}
            onEdit={(serv) => setSelectedServicio(serv)}
            onDelete={(serv) => setServicioToDelete(serv)}
          />
        )
      ) : loadingDientes ? (
        <div className="py-16 text-center text-xs font-semibold text-[#0077D4] dark:text-[#00C2E0] flex flex-col items-center justify-center gap-2">
          <Activity className="animate-spin text-[#0077D4] dark:text-[#00C2E0]" size={24} />
          <span>Cargando directorio de piezas dentales...</span>
        </div>
      ) : isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-7">
            <DienteTable
              dientes={dientes}
              onEdit={(d) => {
                setSelectedDiente(d);
                window.scrollTo({ top: 250, behavior: 'smooth' });
              }}
              onDelete={(d) => {
                setDienteToDelete(d);
              }}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-5">
            <DienteFormPanel
              onSubmit={handleCreateOrUpdateDiente}
              diente={selectedDiente}
              onCancelEdit={() => setSelectedDiente(null)}
            />
          </div>
        </div>
      ) : (
        <DienteTable
          dientes={dientes}
          onEdit={(d) => setSelectedDiente(d)}
          onDelete={(d) => setDienteToDelete(d)}
        />
      )}

      {/* DELETE CONFIRMATION MODALS */}
      {servicioToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-rose-500/40 rounded-2xl shadow-2xl p-6 w-full max-w-md text-[#0840A8] dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400 font-bold text-base">
              <AlertTriangle size={24} />
              <span>Confirmar Eliminación</span>
            </div>
            <p className="text-xs text-[#0077D4] dark:text-blue-100/90 leading-relaxed font-medium">
              ¿Estás seguro de que deseas eliminar el servicio{' '}
              <strong className="text-[#0840A8] dark:text-white">"{servicioToDelete.nombre}"</strong> ({servicioToDelete.codigo_servicio})? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setServicioToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteServicio}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-[#0840A8] dark:text-white text-xs font-bold cursor-pointer"
              >
                Eliminar Servicio
              </button>
            </div>
          </div>
        </div>
      )}

      {dienteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#002D5E] border border-rose-500/40 rounded-2xl shadow-2xl p-6 w-full max-w-md text-[#0840A8] dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400 font-bold text-base">
              <AlertTriangle size={24} />
              <span>Confirmar Eliminación de Pieza Dental</span>
            </div>
            <p className="text-xs text-[#0077D4] dark:text-blue-100/90 leading-relaxed font-medium">
              ¿Estás seguro de que deseas eliminar la pieza dental FDI Nº{' '}
              <strong className="text-[#0840A8] dark:text-white">{dienteToDelete.numero_diente}</strong> ({dienteToDelete.nombre})? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDienteToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteDiente}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-[#0840A8] dark:text-white text-xs font-bold cursor-pointer"
              >
                Eliminar Diente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
