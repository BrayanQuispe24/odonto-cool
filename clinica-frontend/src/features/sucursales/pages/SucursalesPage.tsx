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
import { SucursalFormModal } from '../components/SucursalFormModal';
import { AssignDoctorModal } from '../components/AssignDoctorModal';
import { SucursalDetailsModal } from '../components/SucursalDetailsModal';
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

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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
    await fetchSucursales();
  };

  const handleUpdateSucursal = async (data: SucursalFormData) => {
    if (!selectedSucursal) return;
    const updated = await updateSucursalApi(selectedSucursal.id, data);
    toast.success(`Sucursal ${updated.nombre} actualizada correctamente.`);
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
      {/* PAGE HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0840A8] dark:text-white flex items-center gap-2">
            <Building2 className="text-[#0077D4] dark:text-[#00C2E0]" size={26} />
            Gestión Multi-Tenant de Sucursales
          </h1>
          <p className="text-xs font-medium text-[#002D5E] dark:text-slate-200 mt-1">
            Administra las sedes clínicas, asignación de médicos especialistas y segmentación tenant de pacientes.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="teal"
            onClick={() => {
              setSelectedSucursal(null);
              setIsFormModalOpen(true);
            }}
            className="shrink-0"
          >
            <Plus size={16} />
            <span>Registrar Sucursal</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* SEARCH BAR & STATS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-4 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, código o ubicación..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-[#0840A8]/15 dark:border-[#0840A8]/20 dark:border-[#00C2E0]/40 bg-white dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder-[#0077D4]/60 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-[#0077D4] dark:text-[#00C2E0]" />
        </div>

        <div className="text-xs font-bold text-[#0077D4] dark:text-[#00C2E0]">
          Total Sucursales Registradas: <span className="text-[#0840A8] dark:text-white">{sucursales.length}</span>
        </div>
      </div>

      {/* SUCURSALES GRID */}
      {loading ? (
        <div className="p-12 text-center text-[#0077D4] dark:text-[#00C2E0] text-sm font-medium">
          Cargando sedes y sucursales clínicas...
        </div>
      ) : filteredSucursales.length === 0 ? (
        <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl p-12 text-center text-[#0840A8] dark:text-white">
          <p className="text-sm font-medium">No se encontraron sucursales activas.</p>
          <p className="text-xs text-[#0077D4] dark:text-[#00C2E0] mt-1">
            Registra una nueva sucursal clínica para comenzar la gestión por sedes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSucursales.map((sucursal) => (
            <div
              key={sucursal.id}
              className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-4"
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#E5F7FF] dark:bg-[#0840A8]/60 text-[#0840A8] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
                      {sucursal.codigo_sucursal}
                    </span>
                    <h3
                      onClick={() => {
                        setSelectedSucursal(sucursal);
                        setIsDetailsModalOpen(true);
                      }}
                      className="text-lg font-extrabold text-[#0840A8] dark:text-white mt-1.5 leading-snug hover:text-[#0077D4] dark:hover:text-[#0077D4] dark:text-[#00C2E0] cursor-pointer transition-colors"
                    >
                      {sucursal.nombre}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                      sucursal.estado
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {sucursal.estado ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {sucursal.estado ? 'Operativa' : 'Inactiva'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-[#002D5E] dark:text-slate-200">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0 mt-0.5" />
                    <span className="leading-tight">{sucursal.ubicacion}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                    <span>{sucursal.telefono || 'Sin teléfono asignado'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                    <span>{sucursal.horario_atencion || 'Horario continuo'}</span>
                  </div>
                </div>

                {/* Counters Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-[#F4F9FF]/80 dark:bg-[#001C3D]/60 border border-[#0840A8]/15 dark:border-[#0840A8]/10 dark:border-[#00C2E0]/20 text-center">
                  <div>
                    <div className="text-base font-extrabold text-[#0840A8] dark:text-white">
                      {sucursal.doctores_count ?? 0}
                    </div>
                    <div className="text-[10px] font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center gap-1">
                      <UserCheck size={10} /> Doctores
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-[#0840A8] dark:text-white">
                      {sucursal.pacientes_count ?? 0}
                    </div>
                    <div className="text-[10px] font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center gap-1">
                      <Users size={10} /> Pacientes
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-extrabold text-[#0840A8] dark:text-white">
                      {sucursal.users_count ?? 0}
                    </div>
                    <div className="text-[10px] font-bold text-[#0077D4] dark:text-[#00C2E0] flex items-center justify-center gap-1">
                      <ShieldCheck size={10} /> Usuarios
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/10 dark:border-[#00C2E0]/20 mt-4">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setSelectedSucursal(sucursal);
                      setIsAssignModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#E5F7FF] dark:bg-[#0840A8]/40 text-[#0077D4] dark:text-[#00C2E0] text-xs font-bold flex items-center gap-1 hover:bg-[#0077D4] hover:text-white transition-all cursor-pointer"
                  >
                    <UserPlus size={13} />
                    <span>Asignar Doctor</span>
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedSucursal(sucursal);
                      setIsDetailsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#0077D4] dark:text-slate-300 dark:hover:text-[#0077D4] dark:text-[#00C2E0] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Ver Detalle & Doctores"
                  >
                    <Eye size={15} />
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedSucursal(sucursal);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0077D4] dark:text-slate-300 dark:hover:text-[#0077D4] dark:text-[#00C2E0] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        title="Editar Sucursal"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setSucursalToDelete(sucursal)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Eliminar Sucursal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS MODAL */}
      <SucursalDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        sucursal={selectedSucursal}
        onOpenAssignModal={() => setIsAssignModalOpen(true)}
      />

      {/* FORM MODAL */}
      <SucursalFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={selectedSucursal ? handleUpdateSucursal : handleCreateSucursal}
        sucursalToEdit={selectedSucursal}
      />

      {/* ASSIGN DOCTOR MODAL */}
      <AssignDoctorModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignDoctor}
        sucursal={selectedSucursal}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {sucursalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0D353F] border border-rose-500/40 rounded-2xl shadow-2xl w-full max-w-md p-6 text-[#0840A8] dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0840A8] dark:text-white">Eliminar Sucursal</h3>
                <p className="text-xs text-slate-300">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-xs text-[#002D5E] dark:text-slate-200">
              ¿Estás seguro de que deseas eliminar la sucursal{' '}
              <strong className="text-[#0840A8] dark:text-white">{sucursalToDelete.nombre}</strong> ({sucursalToDelete.codigo_sucursal})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setSucursalToDelete(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteSucursal}>
                Sí, Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
