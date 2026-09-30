import React, { useEffect, useState } from 'react';
import { Upload, FolderOpen } from 'lucide-react';
import { useExpedienteStore } from '../store/useExpedienteStore';
import { ExpedientesTable } from '../components/ExpedientesTable';
import { ExpedienteUploadForm } from '../components/ExpedienteUploadForm';
import { ExpedienteViewerModal } from '../components/ExpedienteViewerModal';
import type { Expediente } from '../types/expediente';
import { toast } from 'sonner';

export const ExpedientesPage: React.FC = () => {
  const { expedientes, isLoading, fetchExpedientes, deleteExpediente } = useExpedienteStore();
  const [viewerExpediente, setViewerExpediente] = useState<Expediente | null>(null);

  useEffect(() => {
    fetchExpedientes();
  }, [fetchExpedientes]);

  const handleDelete = async (expediente: Expediente) => {
    if (window.confirm(`¿Estás seguro de eliminar el expediente "${expediente.titulo}"? Esta acción no se puede deshacer.`)) {
      try {
        await deleteExpediente(expediente.id);
        toast.success('El expediente ha sido eliminado correctamente.');
      } catch (error) {
        toast.error('No se pudo eliminar el expediente.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white p-4 sm:p-6 transition-colors duration-300 overflow-x-hidden">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] flex items-center justify-center shadow-lg shadow-[#0077D4]/20">
              <FolderOpen className="text-white" size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0840A8] dark:text-white tracking-tight">
              Expedientes y PDFs
            </h1>
          </div>
          <p className="text-sm font-medium text-[#0077D4] dark:text-[#00C2E0] max-w-2xl">
            Gestiona resultados de análisis, radiografías y documentos de pacientes.
          </p>
        </div>
      </div>

      {/* CONTENT SECTION: Side by Side Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        
        {/* Formulario (Columna izquierda en XL) */}
        <div className="xl:col-span-4 sticky top-6">
          <ExpedienteUploadForm />
        </div>

        {/* Tabla (Columna derecha en XL) */}
        <div className="xl:col-span-8">
          {isLoading && expedientes.length === 0 ? (
            <div className="flex justify-center items-center py-20 bg-white dark:bg-[#002D5E] rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C2E0]"></div>
            </div>
          ) : (
            <ExpedientesTable
              expedientes={expedientes}
              onView={(exp) => setViewerExpediente(exp)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* MODAL VISOR */}
      <ExpedienteViewerModal
        isOpen={!!viewerExpediente}
        onClose={() => setViewerExpediente(null)}
        expediente={viewerExpediente}
      />
    </div>
  );
};
