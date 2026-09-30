import React, { useState, useEffect } from 'react';
import { UserCheck, FileText, Activity, Clock, Trash2, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { PatientListPanel } from '../components/PatientListPanel';
import { PatientHeaderBanner } from '../components/PatientHeaderBanner';
import { PatientFichaTab } from '../components/PatientFichaTab';
import { PatientAntecedentesTab } from '../components/PatientAntecedentesTab';
import { PatientHistorialTab } from '../components/PatientHistorialTab';
import { PatientCreateModal } from '../components/PatientCreateModal';
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
  const [activeTab, setActiveTab] = useState<'ficha' | 'antecedentes' | 'historial'>('ficha');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      await fetchPatients();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al suspender el paciente');
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE TITLE BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#002D5E] p-6 rounded-2xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0840A8] dark:text-white flex items-center gap-2">
            <UserCheck className="text-[#0077D4] dark:text-[#00C2E0]" size={26} />
            Consola Unificada de Pacientes
          </h1>
          <p className="text-xs font-medium text-[#002D5E] dark:text-slate-200 mt-1">
            Expediente clínico integral: Registro, Ficha Filiatoria, Antecedentes Odontomédicos e Historial de Evolución en una sola vista.
          </p>
        </div>

        <Button variant="teal" onClick={() => setIsCreateModalOpen(true)} className="shrink-0">
          <Plus size={16} />
          <span>Registrar Paciente</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* MASTER-DETAIL UNIFIED WORKSPACE */}
      {loading && patients.length === 0 ? (
        <div className="p-12 text-center text-[#0077D4] dark:text-[#00C2E0] text-sm font-medium">
          Cargando expedientes clínicos de pacientes...
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN: MASTER LIST */}
          <PatientListPanel
            patients={patients}
            selectedPatientId={selectedPatient?.id || null}
            onSelectPatient={(p) => setSelectedPatient(p)}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />

          {/* RIGHT COLUMN: WORKSPACE FOR SELECTED PATIENT */}
          <div className="flex-1 min-w-0 space-y-5">
            {selectedPatient ? (
              <>
                {/* Active Patient Banner */}
                <PatientHeaderBanner
                  patient={selectedPatient}
                  onEdit={() => setActiveTab('ficha')}
                  onDelete={() => setIsDeleteModalOpen(true)}
                />

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/20 pb-1 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('ficha')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      activeTab === 'ficha'
                        ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-xs'
                        : 'bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30 hover:bg-[#F4F9FF] dark:hover:bg-[#0840A8]'
                    }`}
                  >
                    <FileText size={15} />
                    <span>Ficha & Datos Personales</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('antecedentes')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      activeTab === 'antecedentes'
                        ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-xs'
                        : 'bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30 hover:bg-[#F4F9FF] dark:hover:bg-[#0840A8]'
                    }`}
                  >
                    <Activity size={15} />
                    <span>Antecedentes Médicos & Alergias</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('historial')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      activeTab === 'historial'
                        ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-xs'
                        : 'bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30 hover:bg-[#F4F9FF] dark:hover:bg-[#0840A8]'
                    }`}
                  >
                    <Clock size={15} />
                    <span>Historial & Evolución Clínica</span>
                  </button>
                </div>

                {/* Tab Active Content */}
                <div className="pt-2">
                  {activeTab === 'ficha' && (
                    <PatientFichaTab patient={selectedPatient} onSave={handleSavePatientFicha} />
                  )}

                  {activeTab === 'antecedentes' && (
                    <PatientAntecedentesTab patientId={selectedPatient.id} />
                  )}

                  {activeTab === 'historial' && (
                    <PatientHistorialTab patient={selectedPatient} />
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-[#002D5E] border border-[#0840A8]/15 dark:border-[#00C2E0]/30 rounded-2xl p-12 text-center text-[#0840A8] dark:text-white">
                <p className="text-sm font-medium">No hay ningún paciente seleccionado.</p>
                <p className="text-xs text-[#0077D4] dark:text-[#00C2E0] mt-1">
                  Selecciona un paciente de la lista izquierda o registra uno nuevo.
                </p>
                <Button variant="teal" onClick={() => setIsCreateModalOpen(true)} className="mt-4">
                  Registrar Primer Paciente
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE PATIENT MODAL */}
      <PatientCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePatient}
      />

      {/* DELETE / SUSPEND CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0D353F] border border-rose-500/40 rounded-2xl shadow-2xl w-full max-w-md p-6 text-[#0840A8] dark:text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0840A8] dark:text-white">Suspender Paciente</h3>
                <p className="text-xs text-slate-300">El expediente pasará a estado inactivo.</p>
              </div>
            </div>

            <p className="text-xs text-[#002D5E] dark:text-slate-200">
              ¿Estás seguro de que deseas suspender al paciente{' '}
              <strong className="text-[#0840A8] dark:text-white">
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
