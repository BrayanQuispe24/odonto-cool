import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Clock,
  UserCheck,
  Users,
  ShieldCheck,
  Edit2,
  Trash2,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { SucursalFormPanel } from '../components/SucursalFormPanel';
import { AssignDoctorModal } from '../components/AssignDoctorModal';
import { SucursalDetailsPanel } from '../components/SucursalDetailsPanel';
import type { Sucursal, SucursalFormData } from '../types/sucursal';
import {
  getSucursalesApi,
  createSucursalApi,
  updateSucursalApi,
  deleteSucursalApi,
  assignDoctorSucursalApi,
} from '../services/sucursalService';
import { useUserRole } from '../../../hooks/useUserRole';

export const SucursalesPage: React.FC = () => {
  const { isAdmin } = useUserRole();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Navigation state
  const [mainTab, setMainTab] = useState<'list' | 'form' | 'detail'>('list');
  
  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(null);
  const [sucursalToDelete, setSucursalToDelete] = useState<Sucursal | null>(null);

  const fetchSucursales = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getSucursalesApi();
      setSucursales(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar las sucursales.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleCreateSucursal = async (data: SucursalFormData) => {
    const newSucursal = await createSucursalApi(data);
    toast.success(`Sucursal ${newSucursal.nombre} registrada correctamente.`);
    setMainTab('list');
    await fetchSucursales();
  };

  const handleUpdateSucursal = async (data: SucursalFormData) => {
    if (!selectedSucursal) return;
    const updated = await updateSucursalApi(selectedSucursal.id, data);
    toast.success(`Sucursal ${updated.nombre} actualizada correctamente.`);
    setMainTab('list');
    await fetchSucursales();
  };

  const handleDeleteSucursal = async () => {
    if (!sucursalToDelete) return;
    try {
      await deleteSucursalApi(sucursalToDelete.id);
      toast.info(`Sucursal ${sucursalToDelete.nombre} eliminada correctamente.`);
      setSucursalToDelete(null);
      await fetchSucursales();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar la sucursal.');
    }
  };

  const handleAssignDoctor = async (doctorId: number) => {
    if (!selectedSucursal) return;
    const doctor = await assignDoctorSucursalApi(selectedSucursal.id, doctorId);
    toast.success(`Doctor Dr. ${doctor.nombre} ${doctor.apellido} asignado a ${selectedSucursal.nombre}.`);
    await fetchSucursales();
  };

  const filteredSucursales = sucursales.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.nombre.toLowerCase().includes(term) ||
      s.codigo_sucursal.toLowerCase().includes(term) ||
      s.ubicacion.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* PAGE HEADER BANNER REMOVED AS PER USER REQUEST */}

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
            Listado de Sucursales
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setSelectedSucursal(null);
                setMainTab('form');
              }}
              className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
                mainTab === 'form'
                  ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
              }`}
            >
              Registrar Nueva Sucursal
            </button>
          )}
        </div>
      )}

      {/* LIST TAB */}
      {mainTab === 'list' && (
        <div className="w-full animate-fade-in space-y-4">
          {/* SEARCH BAR, STATS & ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-dark-surface p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, código o ubicación..."
            className="w-full pl-9 pr-3 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <Search size={15} className="absolute left-3 top-2 text-slate-400" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto justify-end">
          <div className="text-small font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Sucursales: <span className="text-primary-dark dark:text-white">{sucursales.length}</span>
          </div>
        </div>
      </div>

      {/* SUCURSALES GRID */}
      {loading ? (
        <div className="p-12 text-center text-primary dark:text-secondary text-sm font-medium">
          Cargando sedes y sucursales clínicas...
        </div>
      ) : filteredSucursales.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm p-12 text-center text-primary-dark dark:text-white">
          <p className="text-small font-bold">No se encontraron sucursales activas.</p>
          <p className="text-small text-slate-500 dark:text-slate-400 mt-1">
            Registra una nueva sucursal clínica para comenzar la gestión por sedes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSucursales.map((sucursal) => (
            <div
              key={sucursal.id}
              className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex flex-col justify-between hover:border-[#0077D4] transition-colors p-5 space-y-4"
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-micro font-mono font-bold px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                      {sucursal.codigo_sucursal}
                    </span>
                    <h3
                      onClick={() => {
                        setSelectedSucursal(sucursal);
                        setMainTab('detail');
                      }}
                      className="text-base font-bold text-primary-dark dark:text-white mt-2 leading-snug hover:text-[#0077D4] cursor-pointer transition-colors"
                    >
                      {sucursal.nombre}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-micro font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                      sucursal.estado
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                    }`}
                  >
                    {sucursal.estado ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {sucursal.estado ? 'Operativa' : 'Inactiva'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-small text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{sucursal.ubicacion}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span>{sucursal.telefono || 'Sin teléfono asignado'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400 shrink-0" />
                    <span>{sucursal.horario_atencion || 'Horario continuo'}</span>
                  </div>
                </div>

                {/* Counters Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <div className="text-base font-bold text-primary-dark dark:text-white">
                      {sucursal.doctores_count ?? 0}
                    </div>
                    <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                      <UserCheck size={10} /> Doctores
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-bold text-primary-dark dark:text-white">
                      {sucursal.pacientes_count ?? 0}
                    </div>
                    <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                      <Users size={10} /> Pacientes
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-bold text-primary-dark dark:text-white">
                      {sucursal.users_count ?? 0}
                    </div>
                    <div className="text-micro font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                      <ShieldCheck size={10} /> Usuarios
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setSelectedSucursal(sucursal);
                      setIsAssignModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <UserPlus size={14} className="text-slate-500" />
                    <span>Asignar Dr.</span>
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedSucursal(sucursal);
                      setMainTab('detail');
                    }}
                    className="p-1.5 rounded-sm text-slate-500 hover:text-[#0077D4] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Ver Detalle & Doctores"
                  >
                    <Eye size={16} />
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedSucursal(sucursal);
                          setMainTab('form');
                        }}
                        className="p-1.5 rounded-sm text-slate-500 hover:text-[#0077D4] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Editar Sucursal"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setSucursalToDelete(sucursal)}
                        className="p-1.5 rounded-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
                        title="Eliminar Sucursal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      )}

      {/* FORM TAB */}
      {mainTab === 'form' && (
        <div className="w-full lg:w-3/5 mx-auto animate-fade-in">
          <SucursalFormPanel
            onSubmit={selectedSucursal ? handleUpdateSucursal : handleCreateSucursal}
            onCancel={() => setMainTab('list')}
            sucursalToEdit={selectedSucursal}
          />
        </div>
      )}

      {/* DETAIL TAB */}
      {mainTab === 'detail' && (
        <div className="w-full lg:w-4/5 mx-auto animate-fade-in">
          <SucursalDetailsPanel
            sucursal={selectedSucursal}
            onClose={() => setMainTab('list')}
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
          />
        </div>
      )}

      {/* ASSIGN DOCTOR MODAL */}
      <AssignDoctorModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignDoctor}
        sucursal={selectedSucursal}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {sucursalToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-sm bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-white">
                  Eliminar Sucursal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="p-5">
              <p className="text-small text-slate-700 dark:text-slate-300">
                ¿Estás seguro de que deseas eliminar la sucursal{' '}
                <strong className="text-primary-dark dark:text-white font-bold">{sucursalToDelete.nombre}</strong> ({sucursalToDelete.codigo_sucursal})?
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSucursalToDelete(null)}
                className="px-4 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteSucursal}
                className="px-4 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-small font-semibold transition-colors cursor-pointer shadow-sm"
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
