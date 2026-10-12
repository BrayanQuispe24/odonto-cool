import React, { useEffect, useState } from 'react';
import { ExpedientesTable } from '../../expedientes/components/ExpedientesTable';
import { ExpedienteUploadForm } from '../../expedientes/components/ExpedienteUploadForm';
import { ExpedienteViewerModal } from '../../expedientes/components/ExpedienteViewerModal';
import { useExpedienteStore } from '../../expedientes/store/useExpedienteStore';
import type { Expediente } from '../../expedientes/types/expediente';
import type { Paciente } from '../types/patient';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PatientExpedientesTabProps {
  patient: Paciente;
}

export const PatientExpedientesTab: React.FC<PatientExpedientesTabProps> = ({ patient }) => {
  const { expedientes, isLoading, fetchExpedientes, deleteExpediente } = useExpedienteStore();
  const [viewerExpediente, setViewerExpediente] = useState<Expediente | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchExpedientes();
  }, [fetchExpedientes]);

  const patientExpedientes = expedientes.filter(e => e.paciente_id === patient.id);

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
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-3 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-slate-300">
          Documentos Médicos y Radiografías
        </h3>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={13} /> Subir Nuevo Archivo
        </button>
      </div>

      <div className="w-full">
        {isLoading && patientExpedientes.length === 0 ? (
          <div className="flex justify-center items-center py-20 bg-white dark:bg-dark-surface rounded-sm border border-slate-200 dark:border-slate-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ExpedientesTable
            expedientes={patientExpedientes}
            onView={(exp) => setViewerExpediente(exp)}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ExpedienteViewerModal
        isOpen={!!viewerExpediente}
        onClose={() => setViewerExpediente(null)}
        expediente={viewerExpediente}
      />

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md relative bg-white dark:bg-dark-bg rounded-sm shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-surface">
              <h3 className="text-small font-bold uppercase tracking-wider text-primary-dark dark:text-slate-300">
                Subir Nuevo Documento
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto">
              <ExpedienteUploadForm preselectedPatientId={patient.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
