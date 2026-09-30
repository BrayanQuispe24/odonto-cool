import React, { useState, useMemo } from 'react';
import {
  Edit2,
  Mail,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserX,
} from 'lucide-react';
import type { User } from '../../auth/store/authStore';

interface UserTableProps {
  users: User[];
  onView?: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onView, onEdit, onDelete }) => {
  // Filters and state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUserIds, setSelectedUserIds] = useState<(number | string)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Extract unique roles
  const uniqueRoles = useMemo(() => {
    const rolesSet = new Set<string>();
    users.forEach((u) => {
      if (u.rol?.nombre) rolesSet.add(u.rol.nombre);
    });
    return Array.from(rolesSet);
  }, [users]);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const code = user.codigo_usuario || `USR-${user.id}`;
      const name = user.name || user.email.split('@')[0];
      const matchesSearch =
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        selectedRole === 'all' ||
        (user.rol?.nombre && user.rol.nombre.toLowerCase() === selectedRole.toLowerCase());

      const isUserActive = true;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && isUserActive) ||
        (selectedStatus === 'suspended' && !isUserActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  // Selection logic
  const allPaginatedSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedUserIds.includes(u.id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const paginatedIds = paginatedUsers.map((u) => u.id);
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...paginatedIds])));
    } else {
      const paginatedIds = new Set(paginatedUsers.map((u) => u.id));
      setSelectedUserIds((prev) => prev.filter((id) => !paginatedIds.has(id)));
    }
  };

  const handleSelectRow = (id: number | string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getInitials = (email: string) => {
    const namePart = email.split('@')[0] || 'US';
    return namePart.slice(0, 1).toUpperCase();
  };

  const getNameFromEmail = (email: string) => {
    const part = email.split('@')[0];
    return part
      .split('.')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  };

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, filteredUsers.length);

  return (
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-sm dark:shadow-[#001C3D]/50 overflow-hidden transition-all duration-300">
      {/* ENTERPRISE TOOLBAR */}
      <div className="p-4 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#0840A8]/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0077D4] dark:text-[#00C2E0]">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre, correo, empresa o rol..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs font-medium border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0] focus:ring-1 focus:ring-[#00C2E0] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#0077D4] dark:text-blue-200/70 hover:text-[#0840A8] dark:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00C2E0] cursor-pointer transition-all"
          >
            <option value="all" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
              Todos los Roles
            </option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role} className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
                {role}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0840A8] dark:text-white text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00C2E0] cursor-pointer transition-all"
          >
            <option value="all" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
              Todos los Estados
            </option>
            <option value="active" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
              Activo
            </option>
            <option value="suspended" className="bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white">
              Suspendido
            </option>
          </select>
        </div>
      </div>

      {/* ENTERPRISE DATA TABLE (DESKTOP VIEW) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E5F7FF] dark:bg-[#0840A8]/40 border-b border-[#0840A8]/15 dark:border-[#0840A8]/60 text-[11px] font-extrabold uppercase tracking-wider text-[#0077D4] dark:text-blue-100 select-none">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allPaginatedSelected}
                  onChange={handleSelectAll}
                  className="rounded border-[#0840A8]/15 dark:border-[#0077D4]/60 text-[#0077D4] focus:ring-[#00C2E0] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4">USUARIO / CORREO</th>
              <th className="py-3.5 px-4">ROL ASIGNADO</th>
              <th className="py-3.5 px-4">CÓDIGO / ID</th>
              <th className="py-3.5 px-4">ESTADO</th>
              <th className="py-3.5 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0840A8]/15 dark:divide-[#0840A8]/30 text-xs text-[#0840A8] dark:text-blue-50 font-medium">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#0077D4] dark:text-blue-200/70 font-medium">
                  No se encontraron usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
                const isAdmin = user.rol?.nombre === 'Administrador';
                const isDoctor = user.rol?.nombre === 'Doctor';
                const isSelected = selectedUserIds.includes(user.id);
                const initials = getInitials(user.email);
                const userName = user.name || getNameFromEmail(user.email);

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors duration-200 ${
                      isSelected
                        ? 'bg-[#0077D4]/30'
                        : 'bg-white dark:bg-[#002D5E] hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/30'
                    }`}
                  >
                    {/* CHECKBOX */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(user.id)}
                        className="rounded border-[#0840A8]/15 dark:border-[#0077D4]/60 text-[#0077D4] focus:ring-[#00C2E0] cursor-pointer"
                      />
                    </td>

                    {/* USUARIO / CORREO */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0077D4]/30 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0077D4] dark:text-[#00C2E0] font-extrabold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-[#0840A8] dark:text-white text-xs">
                            {userName}
                          </div>
                          <div className="text-[11px] text-[#0077D4] dark:text-blue-200/70 font-mono flex items-center gap-1">
                            <Mail size={12} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ROL ASIGNADO */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                          isAdmin
                            ? 'bg-purple-950/80 text-purple-200 border border-purple-500/50'
                            : isDoctor
                            ? 'bg-[#0840A8]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/50'
                            : 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                        }`}
                      >
                        {user.rol?.nombre || 'USUARIO'}
                      </span>
                    </td>

                    {/* CÓDIGO / ID */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                        {user.codigo_usuario || `USR-${user.id}`}
                      </span>
                    </td>

                    {/* ESTADO */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVO
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => (onView ? onView(user) : onEdit(user))}
                          title="Ver detalle"
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onEdit(user)}
                          title="Editar usuario"
                          className="p-1.5 rounded-lg bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 transition-colors cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(user)}
                          title="Suspender / Eliminar usuario"
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <UserX size={13} />
                          <span>Suspender</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="block md:hidden p-4 space-y-3">
        {/* Select all bar on mobile */}
        {paginatedUsers.length > 0 && (
          <div className="flex items-center justify-between pb-2 border-b border-[#0840A8]/15 dark:border-[#0840A8]/50 text-xs font-semibold text-[#0077D4] dark:text-blue-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allPaginatedSelected}
                onChange={handleSelectAll}
                className="rounded border-[#0840A8]/15 dark:border-[#0077D4]/60 text-[#0077D4] focus:ring-[#00C2E0]"
              />
              <span>Seleccionar todos ({paginatedUsers.length})</span>
            </label>
            {selectedUserIds.length > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white">
                {selectedUserIds.length} selec.
              </span>
            )}
          </div>
        )}

        {paginatedUsers.length === 0 ? (
          <div className="py-8 text-center text-[#0077D4] dark:text-blue-200/70 text-xs font-medium">
            No se encontraron usuarios que coincidan con la búsqueda.
          </div>
        ) : (
          paginatedUsers.map((user) => {
            const isAdmin = user.rol?.nombre === 'Administrador';
            const isDoctor = user.rol?.nombre === 'Doctor';
            const isSelected = selectedUserIds.includes(user.id);
            const initials = getInitials(user.email);
            const userName = user.name || getNameFromEmail(user.email);

            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#0077D4]/30 border-[#00C2E0] shadow-sm'
                    : 'bg-[#F4F9FF] dark:bg-[#001C3D] border-[#0840A8]/15 dark:border-[#0077D4]/40'
                }`}
              >
                {/* Header: Checkbox + Avatar + User Info + Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(user.id)}
                      className="rounded border-[#0840A8]/15 dark:border-[#0077D4]/60 text-[#0077D4] focus:ring-[#00C2E0] cursor-pointer shrink-0 mt-0.5"
                    />
                    <div className="w-9 h-9 rounded-xl bg-[#0077D4]/30 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0077D4] dark:text-[#00C2E0] font-extrabold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0840A8] dark:text-white text-sm leading-tight">
                        {userName}
                      </h4>
                      <span className="inline-block mt-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#0077D4]/40">
                        {user.codigo_usuario || `USR-${user.id}`}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVO
                  </span>
                </div>

                {/* Info Rows */}
                <div className="space-y-1.5 pt-2 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 text-xs">
                  <div className="flex items-center justify-between text-[#0077D4] dark:text-blue-100">
                    <span className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/70">Correo:</span>
                    <span className="font-mono text-[#0840A8] dark:text-white truncate max-w-[200px] flex items-center gap-1">
                      <Mail size={12} className="text-[#0077D4] dark:text-[#00C2E0] shrink-0" />
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0077D4] dark:text-blue-200/70">Rol:</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                        isAdmin
                          ? 'bg-purple-950/80 text-purple-200 border border-purple-500/50'
                          : isDoctor
                          ? 'bg-[#0840A8]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/50'
                          : 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                      }`}
                    >
                      {user.rol?.nombre || 'USUARIO'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="grid grid-cols-3 gap-1.5 pt-3 mt-3 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50">
                  <button
                    onClick={() => (onView ? onView(user) : onEdit(user))}
                    className="w-full py-1.5 px-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white border border-white/10 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap overflow-hidden"
                  >
                    <Eye size={13} className="shrink-0 text-[#0077D4] dark:text-[#00C2E0]" />
                    <span className="truncate">Ver</span>
                  </button>

                  <button
                    onClick={() => onEdit(user)}
                    className="w-full py-1.5 px-1 rounded-lg bg-[#0077D4]/30 hover:bg-[#0077D4]/50 text-[#0077D4] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap overflow-hidden"
                  >
                    <Edit2 size={13} className="shrink-0" />
                    <span className="truncate">Editar</span>
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="w-full py-1.5 px-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap overflow-hidden"
                  >
                    <UserX size={13} className="shrink-0" />
                    <span className="truncate">Suspender</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#0840A8]/50 bg-[#0840A8]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#0077D4] dark:text-blue-200/80">
        <div>
          Mostrando <strong className="text-[#0840A8] dark:text-white font-bold">{filteredUsers.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong className="text-[#0840A8] dark:text-white font-bold">{endRecord}</strong> de{' '}
          <strong className="text-[#0840A8] dark:text-white font-bold">{filteredUsers.length}</strong> registros
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1.5 rounded-lg border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                safeCurrentPage === pageNum
                  ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30'
                  : 'bg-[#F4F9FF] dark:bg-[#001C3D] border border-[#0840A8]/15 dark:border-[#0077D4]/40 text-[#0077D4] dark:text-blue-100 hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#0840A8]/15 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
