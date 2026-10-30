import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Stethoscope,
  UserCheck,
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminServiciosApi,
  getAdminDoctoresApi,
  toggleServicioLandingApi,
  toggleDoctorLandingApi,
} from '../services/landingDestacadosService';
import type { ServicioDestacado, DoctorDestacado } from '../types/landingDestacados';
import { UserAvatar } from '../../../components/common/UserAvatar';

export const LandingDestacadosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'servicios' | 'doctores'>('servicios');

  // Services state
  const [servicios, setServicios] = useState<ServicioDestacado[]>([]);
  const [serviciosLoading, setServiciosLoading] = useState(true);
  const [servicioSearch, setServicioSearch] = useState('');
  const [servicioFilter, setServicioFilter] = useState<'all' | 'featured' | 'not_featured'>('all');

  // Doctors state
  const [doctores, setDoctores] = useState<DoctorDestacado[]>([]);
  const [doctoresLoading, setDoctoresLoading] = useState(true);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState<'all' | 'featured' | 'not_featured'>('all');

  // Edit Doctor Bio Modal
  const [editingDoctor, setEditingDoctor] = useState<DoctorDestacado | null>(null);
  const [bioInput, setBioInput] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  // Pagination states
  const [pageServicios, setPageServicios] = useState(1);
  const [pageDoctores, setPageDoctores] = useState(1);
  const pageSize = 8;

  const fetchServicios = async () => {
    setServiciosLoading(true);
    try {
      const data = await getAdminServiciosApi();
      setServicios(data);
    } catch {
      toast.error('Error al cargar servicios');
    } finally {
      setServiciosLoading(false);
    }
  };

  const fetchDoctores = async () => {
    setDoctoresLoading(true);
    try {
      const data = await getAdminDoctoresApi();
      setDoctores(data);
    } catch {
      toast.error('Error al cargar doctores');
    } finally {
      setDoctoresLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
    fetchDoctores();
  }, []);

  const handleToggleServicio = async (servicio: ServicioDestacado) => {
    try {
      const updated = await toggleServicioLandingApi(servicio.id);
      setServicios((prev) =>
        prev.map((s) => (s.id === servicio.id ? { ...s, destacado_en_landing: updated.destacado_en_landing } : s))
      );
      toast.success(
        updated.destacado_en_landing
          ? `"${servicio.nombre}" activado en la vitrina web`
          : `"${servicio.nombre}" retirado de la vitrina web`
      );
    } catch {
      toast.error('No se pudo cambiar el estado del servicio');
    }
  };

  const handleToggleDoctor = async (doctor: DoctorDestacado) => {
    try {
      const updated = await toggleDoctorLandingApi(doctor.id);
      setDoctores((prev) =>
        prev.map((d) => (d.id === doctor.id ? { ...d, destacado_en_landing: updated.destacado_en_landing } : d))
      );
      toast.success(
        updated.destacado_en_landing
          ? `Dr(a). ${doctor.nombre} ${doctor.apellido} activado en la vitrina web`
          : `Dr(a). ${doctor.nombre} ${doctor.apellido} retirado de la vitrina web`
      );
    } catch {
      toast.error('No se pudo cambiar el estado del doctor');
    }
  };

  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      setSavingBio(true);
      const updated = await toggleDoctorLandingApi(editingDoctor.id, {
        bio_landing: bioInput,
      });
      setDoctores((prev) =>
        prev.map((d) => (d.id === editingDoctor.id ? { ...d, bio_landing: updated.bio_landing } : d))
      );
      toast.success('Biografía para la vitrina actualizada');
      setEditingDoctor(null);
    } catch {
      toast.error('Error al guardar la biografía');
    } finally {
      setSavingBio(false);
    }
  };

  // Filtered Services
  const filteredServicios = useMemo(() => {
    return servicios.filter((s) => {
      const term = servicioSearch.toLowerCase();
      const matchesSearch =
        s.nombre.toLowerCase().includes(term) ||
        (s.categoria || '').toLowerCase().includes(term);

      const matchesFeatured =
        servicioFilter === 'all'
          ? true
          : servicioFilter === 'featured'
          ? s.destacado_en_landing
          : !s.destacado_en_landing;

      return matchesSearch && matchesFeatured;
    });
  }, [servicios, servicioSearch, servicioFilter]);

  const totalPagesServicios = Math.ceil(filteredServicios.length / pageSize) || 1;
  const currentServicios = useMemo(() => {
    const start = (pageServicios - 1) * pageSize;
    return filteredServicios.slice(start, start + pageSize);
  }, [filteredServicios, pageServicios]);

  // Filtered Doctors
  const filteredDoctores = useMemo(() => {
    return doctores.filter((d) => {
      const term = doctorSearch.toLowerCase();
      const fullName = `${d.nombre} ${d.apellido}`.toLowerCase();
      const specs = (d.especialidades || []).join(' ').toLowerCase();
      const matchesSearch = fullName.includes(term) || specs.includes(term);

      const matchesFeatured =
        doctorFilter === 'all'
          ? true
          : doctorFilter === 'featured'
          ? d.destacado_en_landing
          : !d.destacado_en_landing;

      return matchesSearch && matchesFeatured;
    });
  }, [doctores, doctorSearch, doctorFilter]);

  const totalPagesDoctores = Math.ceil(filteredDoctores.length / pageSize) || 1;
  const currentDoctores = useMemo(() => {
    const start = (pageDoctores - 1) * pageSize;
    return filteredDoctores.slice(start, start + pageSize);
  }, [filteredDoctores, pageDoctores]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={20} className="text-primary dark:text-secondary" />
            Vitrina & Destacados de la Landing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Selecciona qué servicios y qué doctores del sistema se exhiben públicamente a los visitantes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/#especialidades"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink size={14} /> Ver Vitrina en la Web
          </a>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('servicios')}
          className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'servicios'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
          }`}
        >
          <Stethoscope size={15} /> Servicios en Vitrina ({servicios.filter((s) => s.destacado_en_landing).length} activos)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctores')}
          className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'doctores'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
          }`}
        >
          <UserCheck size={15} /> Doctores en Vitrina ({doctores.filter((d) => d.destacado_en_landing).length} activos)
        </button>
      </div>

      {/* TAB 1: SERVICIOS */}
      {activeTab === 'servicios' && (
        <div className="w-full animate-fade-in space-y-4">
          <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  value={servicioSearch}
                  onChange={(e) => {
                    setServicioSearch(e.target.value);
                    setPageServicios(1);
                  }}
                  placeholder="Buscar servicios por nombre o categoría..."
                  className="w-full pl-9 pr-8 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary"
                />
                {servicioSearch && (
                  <button
                    onClick={() => {
                      setServicioSearch('');
                      setPageServicios(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filtro:</span>
                <select
                  value={servicioFilter}
                  onChange={(e) => {
                    setServicioFilter(e.target.value as any);
                    setPageServicios(1);
                  }}
                  className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white focus:outline-none focus:border-primary cursor-pointer min-w-[140px]"
                >
                  <option value="all">Todos los servicios</option>
                  <option value="featured">Solo en vitrina</option>
                  <option value="not_featured">No en vitrina</option>
                </select>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
                    <th className="py-3 px-4">SERVICIO CLÍNICO</th>
                    <th className="py-3 px-4">CATEGORÍA</th>
                    <th className="py-3 px-4">PRECIO REF.</th>
                    <th className="py-3 px-4">ESTADO INTERNO</th>
                    <th className="py-3 px-4 text-center">MOSTRAR EN LANDING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
                  {serviciosLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                        Cargando servicios clínicos...
                      </td>
                    </tr>
                  ) : currentServicios.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                        No se encontraron servicios que coincidan.
                      </td>
                    </tr>
                  ) : (
                    currentServicios.map((s) => (
                      <tr
                        key={s.id}
                        className="bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{s.nombre}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{s.descripcion || 'Sin descripción'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {s.categoria || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          Bs. {Number(s.precio).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-tiny font-bold ${
                              s.estado
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                            }`}
                          >
                            {s.estado ? 'Habilitado' : 'Deshabilitado'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleServicio(s)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-tiny font-bold border cursor-pointer transition-all ${
                              s.destacado_en_landing
                                ? 'bg-primary/10 text-primary dark:text-secondary border-primary/30 hover:bg-primary/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {s.destacado_en_landing ? (
                              <>
                                <CheckCircle size={13} className="text-primary dark:text-secondary" /> En Vitrina
                              </>
                            ) : (
                              <>
                                <XCircle size={13} /> No visible
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="block md:hidden p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
              {currentServicios.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-sm border bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{s.nombre}</div>
                      <div className="text-xs text-slate-500">{s.categoria}</div>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      Bs. {Number(s.precio).toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">¿Visible en Landing?</span>
                    <button
                      type="button"
                      onClick={() => handleToggleServicio(s)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded text-tiny font-bold border cursor-pointer ${
                        s.destacado_en_landing
                          ? 'bg-primary/10 text-primary dark:text-secondary border-primary/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300'
                      }`}
                    >
                      {s.destacado_en_landing ? 'En Vitrina' : 'No visible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between text-xs text-slate-500">
              <div>
                Mostrando {currentServicios.length} de {filteredServicios.length} servicios
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageServicios((p) => Math.max(1, p - 1))}
                  disabled={pageServicios === 1}
                  className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {pageServicios} / {totalPagesServicios}
                </span>
                <button
                  onClick={() => setPageServicios((p) => Math.min(totalPagesServicios, p + 1))}
                  disabled={pageServicios === totalPagesServicios}
                  className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTORES */}
      {activeTab === 'doctores' && (
        <div className="w-full animate-fade-in space-y-4">
          <div className="bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={(e) => {
                    setDoctorSearch(e.target.value);
                    setPageDoctores(1);
                  }}
                  placeholder="Buscar doctores por nombre o especialidad..."
                  className="w-full pl-9 pr-8 px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary"
                />
                {doctorSearch && (
                  <button
                    onClick={() => {
                      setDoctorSearch('');
                      setPageDoctores(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filtro:</span>
                <select
                  value={doctorFilter}
                  onChange={(e) => {
                    setDoctorFilter(e.target.value as any);
                    setPageDoctores(1);
                  }}
                  className="px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-800 dark:text-white focus:outline-none focus:border-primary cursor-pointer min-w-[140px]"
                >
                  <option value="all">Todos los doctores</option>
                  <option value="featured">Solo en vitrina</option>
                  <option value="not_featured">No en vitrina</option>
                </select>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 select-none">
                    <th className="py-3 px-4">DOCTOR(A)</th>
                    <th className="py-3 px-4">ESPECIALIDADES</th>
                    <th className="py-3 px-4">SUCURSAL</th>
                    <th className="py-3 px-4">MINI-BIO LANDING</th>
                    <th className="py-3 px-4 text-center">MOSTRAR EN LANDING</th>
                    <th className="py-3 px-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-small text-slate-700 dark:text-slate-300 font-medium">
                  {doctoresLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                        Cargando equipo médico...
                      </td>
                    </tr>
                  ) : currentDoctores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                        No se encontraron doctores.
                      </td>
                    </tr>
                  ) : (
                    currentDoctores.map((d) => (
                      <tr
                        key={d.id}
                        className="bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-bg/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              fotoPerfil={d.usuario?.foto_perfil}
                              nombre={`${d.nombre} ${d.apellido}`}
                              size="md"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                Dr(a). {d.nombre} {d.apellido}
                              </div>
                              <div className="text-xs text-slate-500">{d.usuario?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {d.especialidades && d.especialidades.length > 0 ? (
                              d.especialidades.map((spec, i) => (
                                <span
                                  key={i}
                                  className="inline-flex px-1.5 py-0.5 rounded text-tiny font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                >
                                  {spec}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-xs">General</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                          {d.sucursal?.nombre || 'Central'}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-xs text-slate-500 line-clamp-1 italic">
                            {d.bio_landing || 'Texto de biografía predeterminado...'}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleDoctor(d)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-tiny font-bold border cursor-pointer transition-all ${
                              d.destacado_en_landing
                                ? 'bg-primary/10 text-primary dark:text-secondary border-primary/30 hover:bg-primary/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {d.destacado_en_landing ? (
                              <>
                                <CheckCircle size={13} className="text-primary dark:text-secondary" /> En Vitrina
                              </>
                            ) : (
                              <>
                                <XCircle size={13} /> No visible
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDoctor(d);
                              setBioInput(d.bio_landing || '');
                            }}
                            className="p-1.5 rounded-sm text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Editar Biografía para la Landing"
                          >
                            <Edit2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="block md:hidden p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
              {currentDoctores.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-sm border bg-white dark:bg-dark-surface border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      fotoPerfil={d.usuario?.foto_perfil}
                      nombre={`${d.nombre} ${d.apellido}`}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        Dr(a). {d.nombre} {d.apellido}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {(d.especialidades || []).join(', ') || 'Odontología'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDoctor(d);
                        setBioInput(d.bio_landing || '');
                      }}
                      className="text-xs font-semibold text-primary dark:text-secondary flex items-center gap-1"
                    >
                      <Edit2 size={12} /> Editar Bio
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDoctor(d)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded text-tiny font-bold border cursor-pointer ${
                        d.destacado_en_landing
                          ? 'bg-primary/10 text-primary dark:text-secondary border-primary/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300'
                      }`}
                    >
                      {d.destacado_en_landing ? 'En Vitrina' : 'No visible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-bg flex items-center justify-between text-xs text-slate-500">
              <div>
                Mostrando {currentDoctores.length} de {filteredDoctores.length} doctores
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageDoctores((p) => Math.max(1, p - 1))}
                  disabled={pageDoctores === 1}
                  className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {pageDoctores} / {totalPagesDoctores}
                </span>
                <button
                  onClick={() => setPageDoctores((p) => Math.min(totalPagesDoctores, p + 1))}
                  disabled={pageDoctores === totalPagesDoctores}
                  className="p-1 rounded-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DOCTOR BIO MODAL */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl w-full max-w-lg p-5 text-slate-900 dark:text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-small font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Edit2 size={16} className="text-primary dark:text-secondary" />
                Biografía para Vitrina Web: Dr(a). {editingDoctor.nombre} {editingDoctor.apellido}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-4">
              <div>
                <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Resumen Profesional / Trayectoria
                </label>
                <textarea
                  rows={4}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Ej. Especialista con más de 8 años de experiencia en ortodoncia digital y diseño de sonrisa..."
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white text-sm focus:outline-none focus:border-primary"
                />
                <p className="text-tiny text-slate-400 mt-1">
                  Este texto se muestra cuando los visitantes seleccionan al especialista en la vitrina de la landing.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingBio}
                  className="px-4 py-1.5 rounded-sm bg-primary hover:bg-primary-dark text-white text-small font-semibold shadow-sm cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Save size={14} /> {savingBio ? 'Guardando...' : 'Guardar Biografía'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
