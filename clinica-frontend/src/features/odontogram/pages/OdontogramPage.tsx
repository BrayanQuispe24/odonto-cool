import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Stethoscope,
  Maximize2,
  FolderPlus,
  Box
} from 'lucide-react';
import { toast } from 'sonner';
import { Odontogram3DViewer } from '../components/Odontogram3DViewer';
import { Modelo3DManagerModal } from '../components/Modelo3DManagerModal';
import { modelo3dService, type Modelo3DItem } from '../services/modelo3dService';
import { useAuthStore } from '../../auth/store/authStore';
import { ShieldAlert } from 'lucide-react';

export const OdontogramPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombre === 'Administrador';

  const [apiModels, setApiModels] = useState<Modelo3DItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('/assets/models/teeth1.glb');
  const [selectedModelName, setSelectedModelName] = useState<string>('Modelo 1: Arcada Completa Maxilar & Mandibular');
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      loadModelsFromBackend();
    }
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <div className="bg-white dark:bg-dark-surface p-12 rounded-sm shadow-sm flex flex-col items-center justify-center text-center space-y-4 border border-slate-200 dark:border-slate-800 h-[70vh]">
        <ShieldAlert size={64} className="text-primary opacity-50 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Acceso Restringido</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-semibold">
          La vista interactiva del Odontograma 3D es una herramienta de uso exclusivo médico. Los usuarios con rol de Administrador no tienen acceso a esta herramienta.
        </p>
      </div>
    );
  }

  const loadModelsFromBackend = async () => {
    try {
      const models = await modelo3dService.getModelos();
      setApiModels(models);
      if (models.length > 0) {
        // Set first model from backend database as active by default
        setSelectedModel(models[0].url);
        setSelectedModelName(models[0].nombre);
      }
    } catch (error) {
      console.warn('Backend API no disponible, usando modelos locales:', error);
    }
  };

  const handleToothSelect = (toothName: string) => {
    setSelectedTooth(toothName);
    toast.info(`Pieza dental seleccionada: ${toothName}`);
  };

  const handleTriggerFullscreen = () => {
    const viewerContainer = document.querySelector('.relative.w-full.bg-\\[\\#001C3D\\]');
    if (viewerContainer) {
      if (!document.fullscreenElement) {
        viewerContainer.requestFullscreen().catch((err) => {
          console.error('Error enabling fullscreen:', err);
        });
      } else {
        document.exitFullscreen().catch((err) => {
          console.error('Error exiting fullscreen:', err);
        });
      }
    }
  };

  const handleSelectModel = (modelUrl: string, name: string) => {
    setSelectedModel(modelUrl);
    setSelectedModelName(name);
    toast.success(`Cargando modelo 3D: ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles size={14} />
            CLÍNICA & 3D / DIAGNÓSTICO AVANZADO
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary-dark dark:text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="text-primary dark:text-secondary" size={24} />
            Odontograma 3D Interactivo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualización tridimensional completa de la arcada dental e inspección médica 360°.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* UPLOAD & MANAGE 3D MODELS BUTTON */}
          <button
            onClick={() => setIsManagerModalOpen(true)}
            className="px-4 py-1.5 rounded-sm bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FolderPlus size={16} className="text-slate-500 dark:text-slate-400" />
            <span>Gestionar Modelos (.GLB)</span>
          </button>

          <button
            onClick={handleTriggerFullscreen}
            className="px-4 py-1.5 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Maximize2 size={16} />
            <span>Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* MODEL SELECTOR TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-dark-surface p-3 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-tiny font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-800 mr-2">
            <Layers size={14} className="text-primary dark:text-secondary" />
            Modelo Activo:
          </span>

          {apiModels.length > 0 ? (
            apiModels.slice(0, 3).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectModel(m.url, m.nombre)}
                className={`px-3 py-1.5 rounded-sm text-small font-semibold transition-colors cursor-pointer flex items-center gap-2 border ${
                  selectedModel === m.url
                    ? 'bg-[#0077D4] border-[#0077D4] text-white shadow-sm'
                    : 'bg-white dark:bg-dark-surface border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles size={14} />
                <span className="truncate max-w-[220px]">{m.nombre}</span>
              </button>
            ))
          ) : (
            <>
              <button
                onClick={() => handleSelectModel('/assets/models/teeth1.glb', 'Modelo 1: Arcada Completa Maxilar & Mandibular')}
                className={`px-3 py-1.5 rounded-sm text-small font-semibold transition-colors cursor-pointer flex items-center gap-2 border ${
                  selectedModel === '/assets/models/teeth1.glb'
                    ? 'bg-[#0077D4] border-[#0077D4] text-white shadow-sm'
                    : 'bg-white dark:bg-dark-surface border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles size={14} />
                <span>Modelo Predeterminado 1</span>
              </button>

              <button
                onClick={() => handleSelectModel('/assets/models/teeth2.OBJ.glb', 'Modelo 2: Detalle Anatómico Superior')}
                className={`px-3 py-1.5 rounded-sm text-small font-semibold transition-colors cursor-pointer flex items-center gap-2 border ${
                  selectedModel === '/assets/models/teeth2.OBJ.glb'
                    ? 'bg-[#0077D4] border-[#0077D4] text-white shadow-sm'
                    : 'bg-white dark:bg-dark-surface border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Layers size={14} />
                <span>Modelo Predeterminado 2</span>
              </button>
            </>
          )}

          {/* ACTIVE CUSTOM MODEL BADGE IF NOT IN FIRST TAB ITEMS */}
          {apiModels.length > 0 && !apiModels.slice(0, 3).some((m) => m.url === selectedModel) && (
            <div className="px-3 py-1.5 rounded-sm text-small font-semibold bg-[#0077D4] border border-[#0077D4] text-white shadow-sm flex items-center gap-2">
              <Box size={14} />
              <span className="truncate max-w-[200px]">{selectedModelName}</span>
              <span className="text-micro bg-white/20 px-1 py-0.5 rounded-sm font-mono uppercase">.GLB Personalizado</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsManagerModalOpen(true)}
          className="px-3 py-1.5 rounded-sm bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-small font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <FolderPlus size={14} />
          <span>Ver Todos los Modelos ({apiModels.length})</span>
        </button>
      </div>

      {/* FULL-WIDTH 3D VIEWER (NO FORMS BELOW) */}
      <div className="w-full">
        <Odontogram3DViewer
          modelUrl={selectedModel}
          selectedToothName={selectedTooth}
          onToothSelect={handleToothSelect}
        />
      </div>

      {/* MODEL MANAGER MODAL */}
      <Modelo3DManagerModal
        isOpen={isManagerModalOpen}
        onClose={() => {
          setIsManagerModalOpen(false);
          loadModelsFromBackend(); // refresh catalog on modal close
        }}
        onSelectModel={(url, name) => {
          handleSelectModel(url, name);
          setIsManagerModalOpen(false);
        }}
        currentModelUrl={selectedModel}
      />
    </div>
  );
};
