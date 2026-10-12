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
  Filter,
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
    <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
      {/* TOOLBAR */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre, correo, código..."
            className="w-full pl-9 pr-8 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">
            <Filter size={14} />
            <span>Filtros:</span>
          </div>
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer min-w-[140px]"
          >
            <option value="all">Todos los Roles</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
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
            className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer min-w-[140px]"
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="suspended">Suspendido</option>
          </select>
        </div>
      </div>

      {/* DESKTOP DATA TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allPaginatedSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-secondary cursor-pointer"
                />
              </th>
              <th className="py-3 px-4">USUARIO / CORREO</th>
              <th className="py-3 px-4">ROL ASIGNADO</th>
              <th className="py-3 px-4">CÓDIGO / ID</th>
              <th className="py-3 px-4">ESTADO</th>
              <th className="py-3 px-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                  No se encontraron usuarios registrados.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                const initials = getInitials(user.email);
                const userName = user.name || getNameFromEmail(user.email);

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors duration-200 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50'
                    }`}
                  >
                    {/* CHECKBOX */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(user.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-secondary cursor-pointer"
                      />
                    </td>

                    {/* USUARIO / CORREO */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-primary-dark dark:text-white text-small">
                            {userName}
                          </div>
                          <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                            <Mail size={12} className="text-slate-400 shrink-0" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ROL ASIGNADO */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-tiny font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {user.rol?.nombre || 'USUARIO'}
                      </span>
                    </td>

                    {/* CÓDIGO / ID */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                        {user.codigo_usuario || `USR-${user.id}`}
                      </span>
                    </td>

                    {/* ESTADO */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ACTIVO
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => (onView ? onView(user) : onEdit(user))}
                          title="Ver detalle"
                          className="p-1.5 rounded-sm text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onEdit(user)}
                          title="Editar usuario"
                          className="p-1.5 rounded-sm text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(user)}
                          title="Suspender usuario"
                          className="p-1.5 rounded-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
                        >
                          <UserX size={14} />
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
      <div className="block md:hidden p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
        {/* Select all bar on mobile */}
        {paginatedUsers.length > 0 && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allPaginatedSelected}
                onChange={handleSelectAll}
                className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-secondary"
              />
              <span>Seleccionar todos ({paginatedUsers.length})</span>
            </label>
            {selectedUserIds.length > 0 && (
              <span className="text-small font-bold px-2 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {selectedUserIds.length} selec.
              </span>
            )}
          </div>
        )}

        {paginatedUsers.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-medium">
            No se encontraron usuarios registrados.
          </div>
        ) : (
          paginatedUsers.map((user) => {
            const isSelected = selectedUserIds.includes(user.id);
            const initials = getInitials(user.email);
            const userName = user.name || getNameFromEmail(user.email);

            return (
              <div
                key={user.id}
                className={`p-4 rounded-sm border transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50'
                    : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800'
                } space-y-3`}
              >
                {/* Header: Checkbox + Avatar + User Info + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(user.id)}
                      className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-secondary cursor-pointer shrink-0 mt-1"
                    />
                    <div className="w-10 h-10 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-dark dark:text-white text-sm">
                        {userName}
                      </h4>
                      <p className="text-xs font-mono font-medium text-slate-500">
                        {user.codigo_usuario || `USR-${user.id}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Rows */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Correo:</span>
                    <span className="font-mono text-primary-dark dark:text-white truncate max-w-[180px] flex items-center gap-1">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Estado:</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ACTIVO
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Rol:</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-tiny font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {user.rol?.nombre || 'USUARIO'}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => (onView ? onView(user) : onEdit(user))}
                    className="w-full py-1.5 px-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Eye size={13} className="shrink-0 text-slate-500" />
                    <span className="truncate">Ver</span>
                  </button>

                  <button
                    onClick={() => onEdit(user)}
                    className="w-full py-1.5 px-1 rounded-sm border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:bg-emerald-100 transition-colors"
                  >
                    <Edit2 size={13} className="shrink-0" />
                    <span className="truncate">Editar</span>
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="w-full py-1.5 px-1 rounded-sm border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap hover:bg-rose-100 transition-colors"
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

      {/* FOOTER PAGINATION */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Mostrando <strong>{filteredUsers.length === 0 ? 0 : startRecord}</strong> -{' '}
          <strong>{endRecord}</strong> de <strong>{filteredUsers.length}</strong> registros
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`min-w-[28px] h-7 px-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                safeCurrentPage === p
                  ? 'bg-[#0077D4] text-white border border-[#0077D4]'
                  : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
