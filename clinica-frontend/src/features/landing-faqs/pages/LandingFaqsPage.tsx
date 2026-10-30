import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  X,
  Save,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminFaqsApi,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi,
} from '../services/landingFaqService';
import type { LandingFaq, LandingFaqFormData } from '../types/landingFaq';
import { useUserRole } from '../../../hooks/useUserRole';

export const LandingFaqsPage: React.FC = () => {
  const { isAdmin } = useUserRole();
  const [faqs, setFaqs] = useState<LandingFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation state
  const [mainTab, setMainTab] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedFaq, setSelectedFaq] = useState<LandingFaq | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LandingFaqFormData>({
    pregunta: '',
    respuesta: '',
    orden: 1,
    estado: true,
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<LandingFaq | null>(null);

  // Table filtering & pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminFaqsApi();
      setFaqs(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar las preguntas frecuentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenCreateForm = () => {
    const nextOrder = (faqs.length > 0 ? Math.max(...faqs.map((f) => f.orden || 0)) : 0) + 1;
    setSelectedFaq(null);
    setFormData({
      pregunta: '',
      respuesta: '',
      orden: nextOrder,
      estado: true,
    });
    setIsReadOnly(false);
    setMainTab('form');
  };

  const handleOpenEditForm = (faq: LandingFaq) => {
    setSelectedFaq(faq);
    setFormData({
      pregunta: faq.pregunta,
      respuesta: faq.respuesta,
      orden: faq.orden,
      estado: faq.estado,
    });
    setIsReadOnly(false);
    setMainTab('form');
  };

  const handleOpenViewForm = (faq: LandingFaq) => {
    setSelectedFaq(faq);
    setFormData({
      pregunta: faq.pregunta,
      respuesta: faq.respuesta,
      orden: faq.orden,
      estado: faq.estado,
    });
    setIsReadOnly(true);
    setMainTab('detail');
  };

  const handleOpenDeleteModal = (faq: LandingFaq) => {
    setFaqToDelete(faq);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      setIsSubmitting(true);
      if (selectedFaq) {
        await updateFaqApi(selectedFaq.id, formData);
        toast.success('Pregunta frecuente actualizada con éxito');
      } else {
        await createFaqApi(formData);
        toast.success('Pregunta frecuente creada con éxito');
      }
      setMainTab('list');
      await fetchFaqs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar la pregunta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      await deleteFaqApi(faqToDelete.id);
      setIsDeleteModalOpen(false);
      toast.info('Pregunta frecuente eliminada');
      setFaqToDelete(null);
      await fetchFaqs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleToggleEstado = async (faq: LandingFaq) => {
    try {
      const updatedEstado = !faq.estado;
      await updateFaqApi(faq.id, { estado: updatedEstado });
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, estado: updatedEstado } : f))
      );
      toast.success(
        updatedEstado
          ? 'Pregunta visible en la landing'
          : 'Pregunta ocultada de la landing'
      );
    } catch {
      toast.error('No se pudo cambiar el estado de la pregunta');
    }
  };

  // Filtered & Paginated list
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        faq.pregunta.toLowerCase().includes(term) ||
        faq.respuesta.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? faq.estado
          : !faq.estado;

      return matchesSearch && matchesStatus;
    });
  }, [faqs, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredFaqs.length / pageSize) || 1;
  const currentFaqs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFaqs.slice(start, start + pageSize);
  }, [filteredFaqs, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 rounded-sm bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN TAB NAVIGATION BAR */}
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
            Listado de Preguntas ({faqs.length})
          </button>
          {isAdmin && (
            <button
              onClick={handleOpenCreateForm}
              className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                mainTab === 'form'
                  ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
              }`}
            >
              <Plus size={14} /> Registrar Nueva Pregunta
            </button>
          )}
        </div>
      )}

      {/* TAB 1: LISTADO DE PREGUNTAS */}
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
                  placeholder="Buscar por pregunta o respuesta..."
                  className="w-full pl-9 pr-8 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Estado:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white focus:outline-none focus:border-primary cursor-pointer min-w-[130px]"
                >
                  <option value="all">Todos</option>
                  <option value="active">Solo Activos</option>
                  <option value="inactive">Ocultos</option>
                </select>
              </div>
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
                    <th className="py-3 px-4 w-16 text-center">ORDEN</th>
                    <th className="py-3 px-4">PREGUNTA & RESPUESTA</th>
                    <th className="py-3 px-4 w-28 text-center">ESTADO</th>
                    <th className="py-3 px-4 text-right w-36">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Cargando preguntas frecuentes...
                      </td>
                    </tr>
                  ) : currentFaqs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No se encontraron preguntas frecuentes.
                      </td>
                    </tr>
                  ) : (
                    currentFaqs.map((faq) => (
                      <tr
                        key={faq.id}
                        className="bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-bold text-slate-500 dark:text-slate-400">
                          <span className="w-6 h-6 inline-flex items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
                            {faq.orden}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white text-small mb-0.5">
                            {faq.pregunta}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                            {faq.respuesta}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => isAdmin && handleToggleEstado(faq)}
                            title={faq.estado ? 'Clic para ocultar' : 'Clic para mostrar'}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-tiny font-bold border cursor-pointer transition-colors ${
                              faq.estado
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {faq.estado ? (
                              <>
                                <CheckCircle size={11} /> Activo
                              </>
                            ) : (
                              <>
                                <XCircle size={11} /> Oculto
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenViewForm(faq)}
                              title="Ver detalle"
                              className="p-1.5 rounded-sm text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => handleOpenEditForm(faq)}
                                  title="Editar pregunta"
                                  className="p-1.5 rounded-sm text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteModal(faq)}
                                  title="Eliminar pregunta"
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

            {/* MOBILE STACKED CARDS VIEW */}
            <div className="block md:hidden p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
              {loading ? (
                <div className="p-8 text-center text-slate-500 text-xs">Cargando preguntas...</div>
              ) : currentFaqs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No hay preguntas registradas.</div>
              ) : (
                currentFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-sm border bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="w-5 h-5 shrink-0 inline-flex items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800 text-tiny font-bold font-mono text-slate-500">
                        #{faq.orden}
                      </span>
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex-1">
                        {faq.pregunta}
                      </div>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-tiny font-bold ${
                          faq.estado
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}
                      >
                        {faq.estado ? 'Activo' : 'Oculto'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {faq.respuesta}
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleOpenViewForm(faq)}
                        className="w-full py-1.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye size={13} /> Ver
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEditForm(faq)}
                            className="w-full py-1.5 rounded-sm border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit2 size={13} /> Editar
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(faq)}
                            className="w-full py-1.5 rounded-sm border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-small font-semibold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={13} /> Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION FOOTER */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Mostrando <strong>{filteredFaqs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> -{' '}
                <strong>{Math.min(currentPage * pageSize, filteredFaqs.length)}</strong> de{' '}
                <strong>{filteredFaqs.length}</strong> preguntas
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
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
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

      {/* TAB 2 & DETAIL: CENTERED FORM PANEL */}
      {(mainTab === 'form' || mainTab === 'detail') && (
        <div className="w-full lg:w-3/5 mx-auto animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle size={18} className="text-primary dark:text-secondary" />
                {isReadOnly
                  ? 'Detalle de Pregunta Frecuente'
                  : selectedFaq
                  ? 'Editar Pregunta Frecuente'
                  : 'Registrar Nueva Pregunta Frecuente'}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Pregunta <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={formData.pregunta}
                    onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
                    placeholder="Ej. ¿Aceptan tarjetas o transferencias?"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Respuesta Detallada <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    disabled={isReadOnly}
                    value={formData.respuesta}
                    onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
                    placeholder="Redacta la explicación clara para los pacientes..."
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Orden de Visualización
                    </label>
                    <input
                      type="number"
                      min={1}
                      disabled={isReadOnly}
                      value={formData.orden}
                      onChange={(e) =>
                        setFormData({ ...formData, orden: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary disabled:opacity-60"
                    />
                    <p className="text-tiny text-slate-400 mt-1">
                      Número menor aparece primero en el acordeón.
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Estado en la Landing
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={isReadOnly}
                        checked={formData.estado}
                        onChange={(e) =>
                          setFormData({ ...formData, estado: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer disabled:opacity-60"
                      />
                      <span className="text-small font-semibold text-slate-700 dark:text-slate-300">
                        {formData.estado
                          ? 'Visible en la página web'
                          : 'Oculto (Borrador)'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {isReadOnly ? (
                <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMainTab('list')}
                    className="px-4 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Volver al Listado
                  </button>
                  {isAdmin && selectedFaq && (
                    <button
                      type="button"
                      onClick={() => handleOpenEditForm(selectedFaq)}
                      className="px-5 py-2 rounded-sm bg-primary hover:bg-primary/90 text-white text-small font-bold shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Edit2 size={14} /> Editar Pregunta
                    </button>
                  )}
                </div>
              ) : (
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
                    className="px-6 py-2 rounded-sm bg-primary hover:bg-primary/90 text-white text-small font-bold shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <Save size={15} />
                    {isSubmitting
                      ? 'Guardando...'
                      : selectedFaq
                      ? 'Actualizar Pregunta'
                      : 'Guardar Pregunta'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* DESTRUCTIVE CONFIRMATION MODAL */}
      {isDeleteModalOpen && faqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-md p-5 text-slate-900 dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded bg-rose-50 dark:bg-rose-900/30">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-small font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Eliminar Pregunta Frecuente
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <p className="text-small text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar la pregunta:{' '}
              <strong className="text-slate-900 dark:text-white font-bold">
                "{faqToDelete.pregunta}"
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setFaqToDelete(null);
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
