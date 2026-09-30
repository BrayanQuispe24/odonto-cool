import React, { useState } from 'react';
import { UserPlus, ShieldCheck, Mail, User as UserIcon, RefreshCw, Stethoscope, Phone } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { UserFormModal } from '../components/UserFormModal';
import type { User } from '../../auth/store/authStore';

export const UsersPage: React.FC = () => {
  const {
    users,
    profile,
    isAdmin,
    isLoading,
    isSubmitting,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (user: User) => {
    setEditingUser(user);
    setIsReadOnly(true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (isReadOnly) return;
    if (editingUser) {
      await updateUser(editingUser.id, formData);
    } else {
      await createUser(formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingUser) {
      await deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* BREADCRUMB & HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-sm dark:shadow-[#001C3D]/50">
        <div>
          <div className="text-[11px] font-extrabold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1">
            ADMIN / <span className="text-[#0840A8] dark:text-white font-bold">GESTIÓN DE USUARIOS</span>
          </div>
          <h1 className="text-2xl font-black font-display text-[#0840A8] dark:text-white tracking-tight">
            {isAdmin ? 'Gestión de Usuarios del Sistema' : 'Mi Perfil de Cuenta'}
          </h1>
          <p className="text-xs text-[#0077D4] dark:text-blue-200/80 font-semibold mt-1">
            {isAdmin
              ? 'Administración centralizada de usuarios: Administradores, Doctores, Pacientes y Personal de la clínica.'
              : 'Información y credenciales asociadas a su cuenta actual.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => refetch()}
            title="Recargar datos"
            className="p-2.5 rounded-xl border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-[#00C2E0] hover:text-[#0840A8] dark:text-white hover:border-[#00C2E0] transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 cursor-pointer transition-all flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span>+ Registrar Usuario</span>
            </button>
          )}
        </div>
      </div>

      {/* ERROR NOTICE */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* ADMIN VIEW: FULL USER LIST & CRUD */}
      {isAdmin ? (
        <div>
          {isLoading ? (
            <div className="p-12 text-center bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0077D4] dark:text-blue-200/80 font-medium">
              Cargando usuarios del sistema...
            </div>
          ) : (
            <UserTable
              users={users}
              onView={handleOpenViewModal}
              onEdit={handleOpenEditModal}
              onDelete={(u) => setDeletingUser(u)}
            />
          )}
        </div>
      ) : (
        /* NON-ADMIN VIEW: PROFILE CARD ONLY */
        <div className="max-w-xl mx-auto bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 p-8 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 space-y-6 text-[#0840A8] dark:text-white">
          <div className="flex items-center gap-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              <UserIcon size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0840A8] dark:text-white">
                {profile?.email || 'Usuario'}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#0840A8]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 mt-1">
                <ShieldCheck size={14} />
                {profile?.rol?.nombre || 'Especialista'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
              <span className="text-[#0077D4] dark:text-blue-200/60 font-bold uppercase tracking-wider block mb-1">
                Código de Usuario
              </span>
              <span className="font-mono text-sm font-bold text-[#0840A8] dark:text-white">
                {profile?.codigo_usuario || `USR-${profile?.id}`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
              <span className="text-[#0077D4] dark:text-blue-200/60 font-bold uppercase tracking-wider block mb-1">
                Correo Electrónico
              </span>
              <span className="font-medium text-sm text-[#0840A8] dark:text-white flex items-center gap-1.5 truncate">
                <Mail size={14} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                {profile?.email}
              </span>
            </div>
          </div>

          {/* DOCTOR INFO SECTION */}
          {profile?.doctor && (
            <div className="pt-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 space-y-4">
              <h3 className="text-[#0077D4] dark:text-[#00C2E0] text-sm font-bold flex items-center gap-2">
                <Stethoscope size={16} />
                Información Médica
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                  <span className="text-[#0077D4] dark:text-blue-200/60 font-bold uppercase tracking-wider block mb-1">
                    Nombre Completo
                  </span>
                  <span className="font-medium text-sm text-[#0840A8] dark:text-white">
                    Dr. {profile.doctor.nombre} {profile.doctor.apellido}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                  <span className="text-[#0077D4] dark:text-blue-200/60 font-bold uppercase tracking-wider block mb-2">
                    Especialidades
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.doctor.especialidades && profile.doctor.especialidades.length > 0 ? (
                      profile.doctor.especialidades.map((esp: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5F7FF] dark:bg-[#0840A8]/40 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-white">
                          {esp}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#0077D4] dark:text-blue-200/40 text-xs italic">No registradas</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 sm:col-span-2">
                  <span className="text-[#0077D4] dark:text-blue-200/60 font-bold uppercase tracking-wider block mb-2">
                    Teléfonos de Contacto
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {profile.doctor.telefonos && profile.doctor.telefonos.length > 0 ? (
                      profile.doctor.telefonos.map((tel: string, i: number) => (
                        <span key={i} className="font-medium text-xs text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E5F7FF] dark:bg-[#0840A8]/30">
                          <Phone size={12} className="text-[#0077D4] dark:text-[#00C2E0]" />
                          {tel}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#0077D4] dark:text-blue-200/40 text-xs italic">No registrados</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FORM MODAL (CREATE / EDIT / VIEW) */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        userToEdit={editingUser}
        isSubmitting={isSubmitting}
        isReadOnly={isReadOnly}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#002D5E] rounded-2xl max-w-sm w-full p-6 shadow-2xl shadow-[#001C3D]/80 border border-rose-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold shadow-inner">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-[#0840A8] dark:text-white tracking-tight">¿Eliminar Usuario?</h3>
            <p className="text-xs text-[#0077D4] dark:text-blue-200/80 leading-relaxed font-medium">
              ¿Está seguro de eliminar la cuenta{' '}
              <strong className="text-[#0840A8] dark:text-white font-bold">{deletingUser.email}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-[#0840A8] dark:text-white text-xs font-bold shadow-md shadow-rose-900/50 cursor-pointer transition-all"
              >
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
