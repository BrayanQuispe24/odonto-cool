import React, { useState, useEffect } from 'react';
import { UserCheck, FileText, Activity, Clock, Trash2, AlertCircle, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { PatientListPanel } from '../components/PatientListPanel';
import { PatientHeaderBanner } from '../components/PatientHeaderBanner';
import { PatientFichaTab } from '../components/PatientFichaTab';
import { PatientAntecedentesTab } from '../components/PatientAntecedentesTab';
import { PatientHistorialTab } from '../components/PatientHistorialTab';
import { PatientExpedientesTab } from '../components/PatientExpedientesTab';
import { PatientFormPanel } from '../components/PatientFormPanel';
import { FolderOpen } from 'lucide-react';
import type { Paciente, PacienteFormData } from '../types/patient';
import {
  getPacientesApi,
  createPacienteApi,
  updatePacienteApi,
  deletePacienteApi,
} from '../services/patientService';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [mainTab, setMainTab] = useState<'list' | 'form' | 'detail'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchPatients = async (selectId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const list = await getPacientesApi();
      setPatients(list);

      if (list.length > 0) {
        if (selectId) {
          const target = list.find((p) => p.id === selectId);
          setSelectedPatient(target || list[0]);
        } else if (!selectedPatient) {
          setSelectedPatient(list[0]);
        } else {
          const current = list.find((p) => p.id === selectedPatient.id);
          setSelectedPatient(current || list[0]);
        }
      } else {
        setSelectedPatient(null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar el expediente de pacientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreatePatient = async (data: PacienteFormData) => {
    const newPatient = await createPacienteApi(data);
    toast.success(`Paciente ${newPatient.nombre} ${newPatient.apellido} registrado exitosamente`);
    await fetchPatients(newPatient.id);
    setMainTab('list');
  };

  const handleSavePatientFicha = async (data: PacienteFormData) => {
    if (!selectedPatient) return;
    const updated = await updatePacienteApi(selectedPatient.id, data);
    await fetchPatients(updated.id);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPatient) return;
    try {
      await deletePacienteApi(selectedPatient.id);
      setIsDeleteModalOpen(false);
      toast.info(`Expediente de ${selectedPatient.nombre} ${selectedPatient.apellido} suspendido`);
      setMainTab('list');
      await fetchPatients();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al suspender el paciente');
    }
  };

  return (
    <div className="space-y-6">


      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Tab Navigation (Hidden in detail mode) */}
      {mainTab !== 'detail' && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setMainTab('list')}
            className={`px-4 py-2 text-small font-semibold border-b-2 transition-all ${
              mainTab === 'list'
                ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
            }`}
          >
            Listado de Pacientes
          </button>
          <button
            onClick={() => setMainTab('form')}
            className={`px-4 py-2 text-small font-semibold border-b-2 transition-all ${
              mainTab === 'form'
                ? 'border-primary text-primary dark:border-secondary dark:text-secondary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-secondary'
            }`}
          >
            Registrar Nuevo Paciente
          </button>
        </div>
      )}

      {/* CONTENT AREA */}
      {mainTab === 'form' && (
        <div className="w-full lg:w-4/5 mx-auto animate-fade-in">
          <PatientFormPanel
            onSubmit={handleCreatePatient}
            onCancel={() => setMainTab('list')}
          />
        </div>
      )}

      {mainTab === 'list' && (
        <div className="w-full animate-fade-in">
          {loading && patients.length === 0 ? (
            <div className="p-12 text-center text-primary dark:text-secondary text-sm font-medium">
              Cargando expedientes clínicos de pacientes...
            </div>
          ) : (
            <PatientListPanel
              patients={patients}
              selectedPatientId={selectedPatient?.id || null}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setMainTab('detail');
              }}
              onOpenCreateModal={() => setMainTab('form')}
            />
          )}
        </div>
      )}

      {mainTab === 'detail' && selectedPatient && (
        <div className="w-full space-y-5 animate-fade-in">
          {/* Back Button */}
          <div className="flex items-center pb-2">
            <button 
              onClick={() => setMainTab('list')}
              className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-secondary hover:text-primary-dark dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Volver al Listado de Pacientes
            </button>
          </div>

          {/* Active Patient Banner */}
          <PatientHeaderBanner
            patient={selectedPatient}
            onEdit={() => {}} // Could be removed or kept as placeholder
            onDelete={() => setIsDeleteModalOpen(true)}
          />

          <div className="pt-2 space-y-8 pb-10 animate-fade-in">
            {/* Seccion 1: Ficha */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-primary-dark dark:text-white flex items-center gap-2">
                <FileText className="text-primary dark:text-secondary" size={22} />
                Ficha & Datos Personales
              </h2>
              <PatientFichaTab patient={selectedPatient} onSave={handleSavePatientFicha} />
            </section>

            {/* Seccion 2: Antecedentes */}
            <section className="space-y-3 pt-4 border-t border-primary-dark/10 dark:border-secondary/15">
              <h2 className="text-xl font-bold text-primary-dark dark:text-white flex items-center gap-2">
                <Activity className="text-primary dark:text-secondary" size={22} />
                Antecedentes Médicos & Alergias
              </h2>
              <PatientAntecedentesTab patientId={selectedPatient.id} />
            </section>

            {/* Seccion 3: Historial */}
            <section className="space-y-3 pt-4 border-t border-primary-dark/10 dark:border-secondary/15">
              <h2 className="text-xl font-bold text-primary-dark dark:text-white flex items-center gap-2">
                <Clock className="text-primary dark:text-secondary" size={22} />
                Historial & Evolución Clínica
              </h2>
              <PatientHistorialTab patient={selectedPatient} />
            </section>

            {/* Seccion 4: Expedientes / PDFs */}
            <section className="space-y-3 pt-4 border-t border-primary-dark/10 dark:border-secondary/15">
              <h2 className="text-xl font-bold text-primary-dark dark:text-white flex items-center gap-2">
                <FolderOpen className="text-primary dark:text-secondary" size={22} />
                Archivos y Documentos Adjuntos
              </h2>
              <PatientExpedientesTab patient={selectedPatient} />
            </section>
          </div>
        </div>
      )}

      {/* DELETE / SUSPEND CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0D353F] border border-rose-500/40 rounded-2xl shadow-2xl w-full max-w-md p-6 text-primary-dark dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary-dark dark:text-white">Suspender Paciente</h3>
                <p className="text-xs text-slate-300">El expediente pasará a estado inactivo.</p>
              </div>
            </div>

            <p className="text-xs text-[#002D5E] dark:text-slate-200">
              ¿Estás seguro de que deseas suspender al paciente{' '}
              <strong className="text-primary-dark dark:text-white">
                {selectedPatient.nombre} {selectedPatient.apellido}
              </strong>{' '}
              ({selectedPatient.codigo_paciente})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Sí, Suspender
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
