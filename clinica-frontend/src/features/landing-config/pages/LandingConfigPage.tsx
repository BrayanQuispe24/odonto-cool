import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Phone,
  Eye,
  Megaphone,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminLandingSettingsApi,
  updateLandingSettingsApi,
} from '../services/landingConfigService';
import type { LandingSettingsData } from '../types/landingConfig';

export const LandingConfigPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'contacto' | 'secciones' | 'anuncio'>('hero');
  const [settings, setSettings] = useState<LandingSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminLandingSettingsApi();
      setSettings(data);
      if (data.hero?.imagen_url) {
        setHeroImagePreview(
          data.hero.imagen_url.startsWith('http')
            ? data.hero.imagen_url
            : `${apiBaseUrl}${data.hero.imagen_url}`
        );
      }
    } catch (err: any) {
      toast.error('Error al cargar la configuración de la landing page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      const updated = await updateLandingSettingsApi(settings, heroImageFile || undefined);
      setSettings(updated);
      setHeroImageFile(null);
      if (updated.hero?.imagen_url) {
        setHeroImagePreview(
          updated.hero.imagen_url.startsWith('http')
            ? updated.hero.imagen_url
            : `${apiBaseUrl}${updated.hero.imagen_url}`
        );
      }
      toast.success('Configuración guardada correctamente');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 text-center text-slate-500 dark:text-slate-400 text-small">
        Cargando configuración de la Landing Page...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER & TABS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={20} className="text-primary dark:text-secondary" />
            Configuración de la Landing Page
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personaliza en tiempo real los textos, números de contacto, imágenes y visibilidad de secciones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink size={14} /> Ver Sitio Web
          </a>
        </div>
      </div>

      {/* HORIZONTAL TAB NAVIGATION */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
          }`}
        >
          <Sparkles size={15} /> Hero & Portada
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contacto')}
          className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'contacto'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
          }`}
        >
          <Phone size={15} /> Contacto & WhatsApp
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('secciones')}
          className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'secciones'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
          }`}
        >
          <Eye size={15} /> Visibilidad de Secciones
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('anuncio')}
          className={`px-4 py-2 text-small font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'anuncio'
              ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
          }`}
        >
          <Megaphone size={15} /> Barra de Anuncios
        </button>
      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleSave} className="w-full lg:w-4/5 mx-auto">
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden p-6 space-y-6">
          {/* TAB 1: HERO & PORTADA */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-small font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Textos Principales del Hero
                </h3>
                <p className="text-tiny text-slate-500 dark:text-slate-400">
                  El primer impacto que reciben tus pacientes al ingresar a la clínica web.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Título Principal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.hero.titulo}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, titulo: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Subtítulo Descriptivo <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={settings.hero.subtitulo}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, subtitulo: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Texto Botón Principal (CTA)
                    </label>
                    <input
                      type="text"
                      value={settings.hero.cta_texto}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          hero: { ...settings.hero, cta_texto: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Texto Botón Secundario
                    </label>
                    <input
                      type="text"
                      value={settings.hero.secundario_texto}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          hero: { ...settings.hero, secundario_texto: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* IMAGEN DEL HERO */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Imagen de Portada / Instalación Destacada
                  </label>

                  {heroImagePreview && (
                    <div className="relative w-full max-w-lg h-52 rounded-sm overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
                      <img
                        src={heroImagePreview}
                        alt="Hero Preview"
                        className="w-full h-full object-cover object-center"
                      />
                      {heroImageFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setHeroImageFile(null);
                            setHeroImagePreview(
                              settings.hero.imagen_url
                                ? (settings.hero.imagen_url.startsWith('http')
                                    ? settings.hero.imagen_url
                                    : `${apiBaseUrl}${settings.hero.imagen_url}`)
                                : null
                            );
                          }}
                          className="absolute top-2 right-2 p-1 rounded-sm bg-rose-600 text-white text-xs hover:bg-rose-700 cursor-pointer"
                          title="Descartar nueva imagen"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setHeroImageFile(file);
                        setHeroImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary dark:file:bg-secondary/10 dark:file:text-secondary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <p className="text-tiny text-slate-400">Recomendado: 1920x1080 o superior en formato JPG/PNG/WEBP.</p>
                </div>

                {/* MÉTRICAS & STATS */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Métricas Destacadas (Contadores Animados)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Pacientes */}
                    <div>
                      <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Pacientes Atendidos
                      </label>
                      <input
                        type="number"
                        value={settings.hero.stats.pacientes_count}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: {
                              ...settings.hero,
                              stats: {
                                ...settings.hero.stats,
                                pacientes_count: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                      />
                    </div>

                    {/* Satisfacción */}
                    <div>
                      <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        % Satisfacción
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.hero.stats.satisfaccion_count}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: {
                              ...settings.hero,
                              stats: {
                                ...settings.hero.stats,
                                satisfaccion_count: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                      />
                    </div>

                    {/* Años */}
                    <div>
                      <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Años de Experiencia
                      </label>
                      <input
                        type="number"
                        value={settings.hero.stats.experiencia_count}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: {
                              ...settings.hero,
                              stats: {
                                ...settings.hero.stats,
                                experiencia_count: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                      />
                    </div>

                    {/* Dolor & Sedación */}
                    <div>
                      <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        % Dolor (0%)
                      </label>
                      <input
                        type="number"
                        value={settings.hero.stats.dolor_count}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hero: {
                              ...settings.hero,
                              stats: {
                                ...settings.hero.stats,
                                dolor_count: Number(e.target.value),
                              },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACTO & WHATSAPP */}
          {activeTab === 'contacto' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-small font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Canales de Comunicación & Redes
                </h3>
                <p className="text-tiny text-slate-500 dark:text-slate-400">
                  Controla a dónde llegan los mensajes de WhatsApp de los botones de agendamiento y datos del footer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Número de WhatsApp (con código de país sin +) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.contacto.whatsapp}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacto: { ...settings.contacto, whatsapp: e.target.value },
                      })
                    }
                    placeholder="Ej. 59178494110"
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                  />
                  <p className="text-tiny text-slate-400 mt-1">Este número se conecta al botón flotante y a los botones de reserva.</p>
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Mensaje Inicial Predeterminado
                  </label>
                  <input
                    type="text"
                    value={settings.contacto.whatsapp_mensaje}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacto: { ...settings.contacto, whatsapp_mensaje: e.target.value },
                      })
                    }
                    placeholder="Hola, quisiera agendar una cita..."
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Teléfono Fijo / Contacto
                  </label>
                  <input
                    type="text"
                    value={settings.contacto.telefono}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacto: { ...settings.contacto, telefono: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Correo Electrónico Oficial
                  </label>
                  <input
                    type="email"
                    value={settings.contacto.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacto: { ...settings.contacto, email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Dirección Principal
                  </label>
                  <input
                    type="text"
                    value={settings.contacto.direccion}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacto: { ...settings.contacto, direccion: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={settings.contacto.horario}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacto: { ...settings.contacto, horario: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Enlace de Instagram
                  </label>
                  <input
                    type="url"
                    value={settings.contacto.instagram_url}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacto: { ...settings.contacto, instagram_url: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/tuclinica"
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISIBILIDAD DE SECCIONES */}
          {activeTab === 'secciones' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-small font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Interruptores de Secciones (On / Off)
                </h3>
                <p className="text-tiny text-slate-500 dark:text-slate-400">
                  Oculta o muestra secciones enteras en la landing page pública con un solo clic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'hero', title: 'Sección Hero & Portada', desc: 'Encabezado principal y métricas' },
                  { key: 'especialidades', title: 'Especialidades / Tratamientos', desc: 'Tarjetas de tratamientos dentales' },
                  { key: 'doctores', title: 'Vitrina de Doctores', desc: 'Equipo médico destacado' },
                  { key: 'instalaciones', title: 'Instalaciones & Tecnología', desc: 'Galería de fotos de la clínica' },
                  { key: 'articulos', title: 'Consejos & Artículos', desc: 'Módulo de blog y salud oral' },
                  { key: 'faqs', title: 'Preguntas Frecuentes (FAQ)', desc: 'Acordeón de dudas comunes' },
                ].map((item) => {
                  const isChecked = settings.secciones_visibles[item.key as keyof typeof settings.secciones_visibles];
                  return (
                    <div
                      key={item.key}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          secciones_visibles: {
                            ...settings.secciones_visibles,
                            [item.key]: !isChecked,
                          },
                        })
                      }
                      className={`p-4 rounded-sm border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-primary/50 bg-primary/5 dark:bg-primary/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{item.title}</span>
                        <div
                          className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                            isChecked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              isChecked ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                      <p className="text-tiny text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: BARRA DE ANUNCIOS */}
          {activeTab === 'anuncio' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-small font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Cintillo Promocional Superior
                </h3>
                <p className="text-tiny text-slate-500 dark:text-slate-400">
                  Muestra un banner superior en la barra de navegación para promociones, campañas o anuncios importantes.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anuncio_activo"
                    checked={settings.anuncio_top.activo}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        anuncio_top: { ...settings.anuncio_top, activo: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="anuncio_activo" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Activar barra de anuncios en la parte superior del sitio web
                  </label>
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Mensaje del Anuncio
                  </label>
                  <input
                    type="text"
                    value={settings.anuncio_top.mensaje}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        anuncio_top: { ...settings.anuncio_top, mensaje: e.target.value },
                      })
                    }
                    placeholder="Ej. ¡20% de descuento en Blanqueamiento Dental este mes!"
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Enlace Opcional al Hacer Clic
                  </label>
                  <input
                    type="text"
                    value={settings.anuncio_top.enlace}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        anuncio_top: { ...settings.anuncio_top, enlace: e.target.value },
                      })
                    }
                    placeholder="Ej. #especialidades o https://wa.me/..."
                    className="w-full px-3 py-2 rounded-sm text-small font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-800 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACTION FOOTER */}
          <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={fetchSettings}
              className="px-4 py-2 rounded-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 text-small font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Descartar Cambios
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-sm bg-primary hover:bg-primary/90 text-white text-small font-bold shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Save size={15} />
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
