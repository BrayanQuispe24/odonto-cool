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

export const OdontogramPage: React.FC = () => {
  const [apiModels, setApiModels] = useState<Modelo3DItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('/assets/models/teeth1.glb');
  const [selectedModelName, setSelectedModelName] = useState<string>('Modelo 1: Arcada Completa Maxilar & Mandibular');
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  useEffect(() => {
    loadModelsFromBackend();
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-sm dark:shadow-[#001C3D]/50">
        <div>
          <div className="text-[11px] font-extrabold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles size={14} />
            CLÍNICA & 3D / DIAGNÓSTICO AVANZADO
          </div>
          <h1 className="text-2xl font-black text-[#0840A8] dark:text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="text-[#0077D4] dark:text-[#00C2E0]" size={26} />
            Odontograma 3D Interactivo
          </h1>
          <p className="text-xs text-[#0077D4] dark:text-blue-200/80 mt-1">
            Visualización tridimensional completa de la arcada dental e inspección médica 360°.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* UPLOAD & MANAGE 3D MODELS BUTTON */}
          <button
            onClick={() => setIsManagerModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] hover:bg-[#0077D4]/30 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 text-[#0840A8] dark:text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <FolderPlus size={16} className="text-[#0077D4] dark:text-[#00C2E0]" />
            <span>Gestionar / Subir Modelos 3D (.GLB)</span>
          </button>

          <button
            onClick={handleTriggerFullscreen}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Maximize2 size={16} />
            <span>Pantalla Completa</span>
          </button>
        </div>
      </div>

      {/* MODEL SELECTOR TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#002D5E] p-2.5 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#0077D4] dark:text-blue-100 px-3 flex items-center gap-1.5">
            <Layers size={14} className="text-[#0077D4] dark:text-[#00C2E0]" />
            Modelo Activo:
          </span>

          {apiModels.length > 0 ? (
            apiModels.slice(0, 3).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectModel(m.url, m.nombre)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedModel === m.url
                    ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30'
                    : 'bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-blue-200 hover:text-white border border-[#0840A8]/15 dark:border-[#0077D4]/30'
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedModel === '/assets/models/teeth1.glb'
                    ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30'
                    : 'bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-blue-200 hover:text-white border border-[#0840A8]/15 dark:border-[#0077D4]/30'
                }`}
              >
                <Sparkles size={14} />
                <span>Modelo Predeterminado 1</span>
              </button>

              <button
                onClick={() => handleSelectModel('/assets/models/teeth2.OBJ.glb', 'Modelo 2: Detalle Anatómico Superior')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedModel === '/assets/models/teeth2.OBJ.glb'
                    ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30'
                    : 'bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0077D4] dark:text-blue-200 hover:text-white border border-[#0840A8]/15 dark:border-[#0077D4]/30'
                }`}
              >
                <Layers size={14} />
                <span>Modelo Predeterminado 2</span>
              </button>
            </>
          )}

          {/* ACTIVE CUSTOM MODEL BADGE IF NOT IN FIRST TAB ITEMS */}
          {apiModels.length > 0 && !apiModels.slice(0, 3).some((m) => m.url === selectedModel) && (
            <div className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30 flex items-center gap-2 border border-cyan-300/40">
              <Box size={14} />
              <span className="truncate max-w-[200px]">{selectedModelName}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-[#0840A8] dark:text-white font-mono uppercase">.GLB Personalizado</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsManagerModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D] hover:bg-[#0077D4] text-[#0077D4] dark:text-[#00C2E0] hover:text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
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
