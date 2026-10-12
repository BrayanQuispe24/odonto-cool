import React, { useState } from 'react';
import { UserPlus, ShieldCheck, Mail, User as UserIcon, RefreshCw, Stethoscope, Phone } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { UserFormPanel } from '../components/UserFormPanel';
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

  const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setIsReadOnly(false);
    setMainTab('form');
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsReadOnly(false);
    setMainTab('form');
  };

  const handleOpenViewModal = (user: User) => {
    setEditingUser(user);
    setIsReadOnly(true);
    setMainTab('form');
  };

  const handleFormSubmit = async (formData: any) => {
    if (isReadOnly) return;
    if (editingUser) {
      await updateUser(editingUser.id, formData);
    } else {
      await createUser(formData);
    }
    setMainTab('list');
  };

  const handleDeleteConfirm = async () => {
    if (deletingUser) {
      await deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-6">


      {/* ERROR NOTICE */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* ADMIN VIEW: FULL USER LIST & CRUD */}
      {isAdmin ? (
        <div>
          {/* Main Tab Navigation */}
          {!(mainTab === 'form' && (editingUser || isReadOnly)) && (
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
              <button
                onClick={() => setMainTab('list')}
                className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
                  mainTab === 'list'
                    ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
                }`}
              >
                Listado de Usuarios
              </button>
              <button
                onClick={handleOpenCreateModal}
                className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
                  mainTab === 'form'
                    ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
                }`}
              >
                Registrar Nuevo Usuario
              </button>
            </div>
          )}

          {mainTab === 'list' && (
            <div className="animate-fade-in space-y-4">
              {isLoading ? (
                <div className="p-12 text-center text-primary dark:text-secondary text-sm font-medium">
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
          )}

          {mainTab === 'form' && (
            <div className="w-full lg:w-3/5 mx-auto animate-fade-in">
              <UserFormPanel
                onSubmit={handleFormSubmit}
                onCancel={() => setMainTab('list')}
                userToEdit={editingUser}
                isSubmitting={isSubmitting}
                isReadOnly={isReadOnly}
              />
            </div>
          )}
        </div>
      ) : (
        /* NON-ADMIN VIEW: PROFILE CARD ONLY */
        <div className="max-w-xl mx-auto bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="w-14 h-14 rounded-sm bg-[#0077D4] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              <UserIcon size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {profile?.email || 'Usuario'}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mt-1">
                <ShieldCheck size={14} />
                {profile?.rol?.nombre || 'Especialista'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Código de Usuario
              </span>
              <span className="font-mono text-small font-bold text-slate-800 dark:text-slate-200">
                {profile?.codigo_usuario || `USR-${profile?.id}`}
              </span>
            </div>

            <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Correo Electrónico
              </span>
              <span className="font-medium text-small text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
                <Mail size={14} className="text-slate-400 shrink-0" />
                {profile?.email}
              </span>
            </div>
          </div>

          {/* DOCTOR INFO SECTION */}
          {profile?.doctor && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-slate-700 dark:text-slate-300 text-small font-bold flex items-center gap-2 uppercase tracking-wider">
                <Stethoscope size={16} className="text-slate-500" />
                Información Médica
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Nombre Completo
                  </span>
                  <span className="font-medium text-small text-slate-800 dark:text-slate-200">
                    Dr. {profile.doctor.nombre} {profile.doctor.apellido}
                  </span>
                </div>

                <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">
                    Especialidades
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.doctor.especialidades && profile.doctor.especialidades.length > 0 ? (
                      profile.doctor.especialidades.map((esp: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-sm text-tiny font-bold bg-[#0077D4]/10 border border-[#0077D4]/20 text-[#0077D4]">
                          {esp}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs italic">No registradas</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 shadow-sm sm:col-span-2">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">
                    Teléfonos de Contacto
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {profile.doctor.telefonos && profile.doctor.telefonos.length > 0 ? (
                      profile.doctor.telefonos.map((tel: string, i: number) => (
                        <span key={i} className="font-medium text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface shadow-sm">
                          <Phone size={12} className="text-slate-400" />
                          {tel}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs italic">No registrados</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}



      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-surface rounded-sm max-w-sm w-full p-6 shadow-xl border border-rose-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">¿Eliminar Usuario?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              ¿Está seguro de eliminar la cuenta{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{deletingUser.email}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-small font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-small font-semibold shadow-sm transition-colors cursor-pointer"
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
