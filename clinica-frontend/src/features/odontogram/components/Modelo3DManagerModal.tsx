import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  FileCode,
  Trash2,
  CheckCircle2,
  HardDrive,
  Sparkles,
  Layers,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { modelo3dService, type Modelo3DItem } from '../services/modelo3dService';

interface Modelo3DManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (modelUrl: string, name: string) => void;
  currentModelUrl?: string;
}

export const Modelo3DManagerModal: React.FC<Modelo3DManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
  currentModelUrl,
}) => {
  const [modelos, setModelos] = useState<Modelo3DItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form states
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadModelos();
    }
  }, [isOpen]);

  const loadModelos = async () => {
    setIsLoading(true);
    try {
      const data = await modelo3dService.getModelos();
      setModelos(data);
    } catch (error) {
      console.error('Error al cargar modelos 3D:', error);
      toast.error('No se pudieron obtener los modelos 3D desde el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'glb') {
      toast.error('Formato no permitido. Solo se permiten archivos tridimensionales .glb');
      return;
    }

    // 100MB limit
    if (file.size > 100 * 1024 * 1024) {
      toast.error('El archivo excede el tamaño máximo permitido (100 MB)');
      return;
    }

    setSelectedFile(file);
    if (!nombre) {
      setNombre(file.name.replace(/\.glb$/i, ''));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Por favor seleccione un archivo .glb');
      return;
    }
    if (!nombre.trim()) {
      toast.error('Por favor ingrese un nombre para el modelo 3D');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newModelo = await modelo3dService.uploadModelo(
        nombre,
        selectedFile,
        descripcion,
        (percent) => setUploadProgress(percent)
      );

      toast.success('¡Modelo 3D (.glb) subido correctamente!');
      setModelos((prev) => [newModelo, ...prev]);

      // Reset form
      setNombre('');
      setDescripcion('');
      setSelectedFile(null);

      // Auto select newly uploaded model
      onSelectModel(newModelo.url, newModelo.nombre);
    } catch (error: any) {
      console.error('Error al subir modelo 3D:', error);
      const msg = error.response?.data?.message || 'Error al subir el modelo .glb al servidor';
      toast.error(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('¿Está seguro de eliminar este modelo 3D?')) return;

    try {
      await modelo3dService.deleteModelo(id);
      toast.success('Modelo 3D eliminado');
      setModelos((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error al eliminar modelo:', error);
      toast.error('Error al eliminar el modelo 3D');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F4F9FF] dark:bg-[#001C3D]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl shadow-2xl shadow-[#001C3D] overflow-hidden text-[#0840A8] dark:text-white flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/20 bg-[#F4F9FF] dark:bg-[#001C3D]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] shadow-md shadow-[#0077D4]/40">
              <Layers size={20} className="text-[#0840A8] dark:text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-[#0840A8] dark:text-white flex items-center gap-2">
                Gestor de Modelos 3D (.GLB)
              </h3>
              <p className="text-xs text-[#0077D4] dark:text-blue-200/70">
                Sube y administra tus escaneos odontológicos tridimensionales personalizados.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0077D4] dark:text-blue-200 hover:text-[#0840A8] dark:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* UPLOAD SECTION FORM */}
          <form onSubmit={handleUploadSubmit} className="space-y-4 bg-[#F4F9FF] dark:bg-[#001C3D]/70 p-5 rounded-xl border border-[#0840A8]/15 dark:border-[#00C2E0]/20">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0077D4] dark:text-[#00C2E0] uppercase tracking-wide">
              <Sparkles size={14} />
              <span>Subir Nuevo Modelo Tridimensional (.GLB)</span>
            </div>

            {/* DRAG & DROP ZONE */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                isDragging
                  ? 'border-[#00C2E0] bg-[#00C2E0]/10 scale-[0.99]'
                  : selectedFile
                  ? 'border-emerald-400/50 bg-emerald-500/10'
                  : 'border-[#0840A8]/15 dark:border-[#00C2E0]/40 hover:border-[#00C2E0] bg-white dark:bg-[#002D5E]/40'
              }`}
            >
              <input
                type="file"
                accept=".glb"
                onChange={handleFileChange}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-sm font-bold text-emerald-200">{selectedFile.name}</p>
                  <p className="text-xs text-emerald-300/70 font-mono">
                    {formatBytes(selectedFile.size)} • Listo para subir
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-[#0077D4]/20 text-[#0077D4] dark:text-[#00C2E0]">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-sm font-bold text-[#0840A8] dark:text-white">
                    Arrastra tu archivo <code className="text-[#0077D4] dark:text-[#00C2E0] font-mono">.glb</code> aquí o haz clic para examinar
                  </p>
                  <p className="text-xs text-[#0077D4] dark:text-blue-200/60">
                    Solo formato 3D binario <span className="text-[#0077D4] dark:text-[#00C2E0] font-semibold">.GLB</span> (Máximo 100 MB)
                  </p>
                </div>
              )}
            </div>

            {/* FORM INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0077D4] dark:text-blue-100 mb-1">Nombre del Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Maxilar Superior Paciente #104"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0840A8] dark:text-white text-xs placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0077D4] dark:text-blue-100 mb-1">Descripción / Notas (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Escaneo post-tratamiento ortodoncia"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 text-[#0840A8] dark:text-white text-xs placeholder:text-[#0077D4] dark:text-blue-200/40 focus:outline-none focus:border-[#00C2E0]"
                />
              </div>
            </div>

            {/* UPLOAD PROGRESS BAR */}
            {isUploading && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-mono text-cyan-300">
                  <span>Subiendo al servidor Laravel...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white dark:bg-[#002D5E] rounded-full overflow-hidden border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#0077D4] to-[#00C2E0] transition-all duration-200 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#0840A8] hover:to-[#0077D4] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#0077D4]/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                <span>{isUploading ? 'Guardando en Servidor...' : 'Subir Modelo 3D'}</span>
              </button>
            </div>
          </form>

          {/* CATALOG LIST OF UPLOADED MODELS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-[#0077D4] dark:text-blue-100 uppercase tracking-wide flex items-center gap-2">
                <HardDrive size={15} className="text-[#0077D4] dark:text-[#00C2E0]" />
                <span>Mis Modelos Almacenados ({modelos.length})</span>
              </h4>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-[#0077D4] dark:text-blue-200/70 text-xs flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin text-[#0077D4] dark:text-[#00C2E0]" />
                <span>Cargando modelos desde Laravel...</span>
              </div>
            ) : modelos.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#F4F9FF] dark:bg-[#001C3D]/40 border border-[#0840A8]/15 dark:border-[#00C2E0]/20 text-center space-y-1">
                <FileCode className="mx-auto text-blue-300/40" size={32} />
                <p className="text-xs font-bold text-[#0840A8] dark:text-white">No tienes modelos 3D personalizados subidos</p>
                <p className="text-[11px] text-[#0077D4] dark:text-blue-200/60">
                  Usa el formulario superior para subir tus escaneos tridimensionales en formato .GLB.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modelos.map((m) => {
                  const isSelected = currentModelUrl === m.url;
                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectModel(m.url, m.nombre)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                        isSelected
                          ? 'bg-[#0077D4]/20 border-[#00C2E0] shadow-md shadow-[#00C2E0]/20'
                          : 'bg-[#F4F9FF] dark:bg-[#001C3D]/60 border-[#0840A8]/15 dark:border-[#00C2E0]/20 hover:border-[#0840A8]/15 dark:border-[#00C2E0]/50 hover:bg-[#F4F9FF] dark:hover:bg-[#001C3D]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0840A8] dark:text-white tracking-wide">{m.nombre}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-md bg-[#00C2E0] text-[#001C3D] text-[10px] font-black uppercase tracking-wider">
                                Activo en Visor
                              </span>
                            )}
                          </div>
                          {m.descripcion && <p className="text-[11px] text-[#0077D4] dark:text-blue-200/70">{m.descripcion}</p>}
                        </div>

                        <button
                          onClick={(e) => handleDelete(m.id, e)}
                          title="Eliminar modelo 3D"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-[#0840A8] dark:text-white transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#0077D4] dark:text-blue-200/60 font-mono">
                        <span>{formatBytes(m.tamanio_bytes)}</span>
                        <span>{m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Subido'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-[#0840A8]/15 dark:border-[#00C2E0]/20 bg-[#F4F9FF] dark:bg-[#001C3D]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#0840A8] dark:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
