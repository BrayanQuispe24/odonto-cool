import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Search, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, Eye, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { getPublicConsejosApi, createConsejoApi, deleteConsejoApi, updateConsejoApi } from '../services/consejoService';
import type { Consejo, ConsejoFormData } from '../types/consejo';
import { useUserRole } from '../../../hooks/useUserRole';

export const ConsejosPage: React.FC = () => {
  const { isAdmin } = useUserRole();
  const [consejos, setConsejos] = useState<Consejo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation state
  const [mainTab, setMainTab] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedConsejo, setSelectedConsejo] = useState<Consejo | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ConsejoFormData>({ titulo: '', categoria: '', descripcion: '' });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [consejoToDelete, setConsejoToDelete] = useState<Consejo | null>(null);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchConsejos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicConsejosApi();
      setConsejos(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar el listado de consejos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsejos();
  }, []);

  const handleOpenCreateForm = () => {
    setSelectedConsejo(null);
    setFormData({ titulo: '', categoria: '', descripcion: '' });
    setIsReadOnly(false);
    setMainTab('form');
  };

  const handleOpenEditForm = (consejo: Consejo) => {
    setSelectedConsejo(consejo);
    setFormData({
      titulo: consejo.titulo,
      categoria: consejo.categoria || '',
      descripcion: consejo.descripcion,
    });
    setIsReadOnly(false);
    setMainTab('form');
  };

  const handleOpenViewForm = (consejo: Consejo) => {
    setSelectedConsejo(consejo);
    setFormData({
      titulo: consejo.titulo,
      categoria: consejo.categoria || '',
      descripcion: consejo.descripcion,
    });
    setIsReadOnly(true);
    setMainTab('detail');
  };

  const handleOpenDeleteModal = (consejo: Consejo) => {
    setConsejoToDelete(consejo);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    try {
      setIsSubmitting(true);
      if (selectedConsejo) {
        await updateConsejoApi(selectedConsejo.id, formData);
        toast.success('Consejo actualizado con éxito');
      } else {
        await createConsejoApi(formData);
        toast.success('Consejo creado con éxito');
      }
      setMainTab('list');
      await fetchConsejos();
    } catch (error) {
      toast.error('Error al guardar el consejo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!consejoToDelete) return;
    try {
      await deleteConsejoApi(consejoToDelete.id);
      setIsDeleteModalOpen(false);
      toast.info('Consejo eliminado');
      setConsejoToDelete(null);
      await fetchConsejos();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  // Filtering & Pagination
  const filteredConsejos = useMemo(() => {
    return consejos.filter((c) => {
      const term = searchTerm.toLowerCase();
      return (
        c.titulo.toLowerCase().includes(term) ||
        (c.categoria || '').toLowerCase().includes(term) ||
        c.descripcion.toLowerCase().includes(term)
      );
    });
  }, [consejos, searchTerm]);

  const totalPages = Math.ceil(filteredConsejos.length / pageSize) || 1;
  const currentConsejos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredConsejos.slice(start, start + pageSize);
  }, [filteredConsejos, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* ERROR MESSAGE */}
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
            Listado de Artículos
          </button>
          {isAdmin && (
            <button
              onClick={handleOpenCreateForm}
              className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer ${
                mainTab === 'form'
                  ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
            }`}
            >
              Registrar Nuevo Artículo
            </button>
          )}
        </div>
      )}

      {/* TABLE CONTENT */}
      {mainTab === 'list' && (
        <div className="w-full animate-fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
            {/* TOOLBAR */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                  placeholder="Buscar artículos por título o descripción..."
                  className="w-full pl-9 pr-8 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-primary-dark dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* TABLE VIEW */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
                    <th className="py-3 px-4">ARTÍCULO</th>
                    <th className="py-3 px-4">CATEGORÍA</th>
                    <th className="py-3 px-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Cargando listado de artículos...
                      </td>
                    </tr>
                  ) : currentConsejos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                        No se encontraron artículos registrados.
                      </td>
                    </tr>
                  ) : (
                    currentConsejos.map((c) => (
                      <tr
                        key={c.id}
                        className="bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-sm bg-slate-100 dark:bg-slate-800 text-primary dark:text-secondary font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                              <FileText size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-primary-dark dark:text-white text-small">
                                {c.titulo}
                              </div>
                              <div className="text-xs text-slate-500 line-clamp-1 max-w-md font-mono">
                                {c.descripcion}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {c.categoria || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenViewForm(c)}
                              title="Ver detalle"
                              className="p-1.5 rounded-sm text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => handleOpenEditForm(c)}
                                  title="Editar artículo"
                                  className="p-1.5 rounded-sm text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteModal(c)}
                                  title="Eliminar artículo"
                                  className="p-1.5 rounded-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER PAGINATION */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Mostrando <strong>{filteredConsejos.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}</strong> -{' '}
                <strong>{Math.min(currentPage * pageSize, filteredConsejos.length)}</strong> de{' '}
                <strong>{filteredConsejos.length}</strong> artículos
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[28px] h-7 px-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                      currentPage === p
                        ? 'bg-[#0077D4] text-white'
                        : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM / DETAIL PANEL */}
      {(mainTab === 'form' || mainTab === 'detail') && (
        <div className="w-full lg:w-3/5 mx-auto animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText size={18} className="text-primary dark:text-secondary" />
                {isReadOnly ? 'Detalle del Artículo' : selectedConsejo ? 'Editar Artículo' : 'Registrar Nuevo Artículo'}
              </h2>
              {isReadOnly && (
                <button
                  onClick={() => setMainTab('list')}
                  className="p-1.5 rounded-sm hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Título <span className="text-rose-500">*</span></label>
                  <input
                    required
                    disabled={isReadOnly}
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900/50"
                    placeholder="Ej. Beneficios de la Ortodoncia..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Categoría / Etiqueta</label>
                  <input
                    disabled={isReadOnly}
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900/50"
                    placeholder="Ej. Estética Dental"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Contenido del Artículo <span className="text-rose-500">*</span></label>
                  <textarea
                    required
                    disabled={isReadOnly}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full min-h-[120px] px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900/50"
                    placeholder="Redacta el contenido aquí..."
                  />
                </div>

                {!isReadOnly && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Imagen de Portada</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.files?.[0] })}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary dark:file:bg-secondary/10 dark:file:text-secondary hover:file:bg-primary/20 dark:hover:file:bg-secondary/20 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Formatos soportados: JPG, PNG, WEBP (Max: 5MB)</p>
                  </div>
                )}
              </div>

              {!isReadOnly && (
                <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMainTab('list')}
                    className="px-4 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-sm bg-primary hover:bg-primary/90 text-white text-small font-bold shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? 'Guardando...' : selectedConsejo ? 'Actualizar Artículo' : 'Guardar Artículo'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && consejoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-md p-5 text-primary-dark dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-900/30">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-small font-bold text-primary-dark dark:text-white uppercase tracking-wider">Eliminar Artículo</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar el artículo{' '}
              <strong className="text-primary-dark dark:text-white font-bold">
                "{consejoToDelete.titulo}"
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConsejoToDelete(null);
                }}
                className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-small font-semibold shadow-sm cursor-pointer transition-colors"
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
