import React, { useState } from 'react';
import { Clock, Plus, Stethoscope, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import type { Paciente } from '../types/patient';

interface PatientHistorialTabProps {
  patient: Paciente;
}

interface EvolutionNote {
  id: string;
  fecha: string;
  doctor: string;
  servicio: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

export const PatientHistorialTab: React.FC<PatientHistorialTabProps> = ({ patient: _patient }) => {
  const [notes, setNotes] = useState<EvolutionNote[]>([
    {
      id: '1',
      fecha: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Roberto Vargas',
      servicio: 'Limpieza Ultrasónica & Profilaxis',
      diagnostico: 'Gingivitis leve generalizada sin pérdida ósea.',
      tratamiento: 'Tartrectomía con ultrasonido y pulido coronario con pasta fluorada.',
      observaciones: 'Se indica uso de hilo dental 2 veces al día y enjuague bucal con clorhexidina 0.12%.',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [servicio, setServicio] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnostico.trim()) return;

    const newNote: EvolutionNote = {
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0],
      doctor: 'Doctor de Turno',
      servicio: servicio.trim() || 'Consulta Odontológica General',
      diagnostico: diagnostico.trim(),
      tratamiento: tratamiento.trim() || 'Evaluación inicial realizada.',
      observaciones: observaciones.trim() || 'Sin observaciones adicionales.',
    };

    setNotes([newNote, ...notes]);
    setServicio('');
    setDiagnostico('');
    setTratamiento('');
    setObservaciones('');
    setShowForm(false);
    toast.success('Nueva atención agregada al expediente clínico');
  };

  return (
    <div className="space-y-6">
      {/* HEADER & NEW RECORD BUTTON */}
      <div className="bg-white dark:bg-[#072B33] border border-ocean-deep/10 dark:border-teal-500/20 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="text-teal-400" size={18} />
            <span>Historial Clínico & Evolución de Tratamientos</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-0.5">
            Registro cronológico de consultas, intervenciones odontológicas y evolución del paciente.
          </p>
        </div>

        <Button variant="teal" onClick={() => setShowForm(!showForm)}>
          <Plus size={15} />
          <span>{showForm ? 'Cancelar' : 'Registrar Atención'}</span>
        </Button>
      </div>

      {/* NEW ATTENTION FORM */}
      {showForm && (
        <form
          onSubmit={handleAddNote}
          className="bg-white dark:bg-[#072B33] border border-teal-500/40 rounded-2xl p-5 space-y-4 animate-fade-in"
        >
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-400 border-b border-teal-500/20 pb-2">
            Nueva Evolución Clínica
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-teal-100 mb-1">
                Tratamiento / Servicio
              </label>
              <input
                type="text"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                placeholder="Ej. Calza de resina, Extracción, Endodoncia..."
                className="w-full px-3 py-2 rounded-lg bg-[#051E24] border border-teal-500/40 text-xs text-[#0840A8] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-100 mb-1">
                Diagnóstico Odontológico <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Ej. Caries oclusal en pieza 1.6..."
                className="w-full px-3 py-2 rounded-lg bg-[#051E24] border border-teal-500/40 text-xs text-[#0840A8] dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-teal-100 mb-1">
                Procedimiento / Tratamiento Realizado
              </label>
              <textarea
                rows={2}
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
                placeholder="Descripción paso a paso del procedimiento..."
                className="w-full px-3 py-2 rounded-lg bg-[#051E24] border border-teal-500/40 text-xs text-[#0840A8] dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-teal-100 mb-1">
                Indicaciones & Receta al Paciente
              </label>
              <input
                type="text"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Medicamentos recetados o indicaciones posteriores..."
                className="w-full px-3 py-2 rounded-lg bg-[#051E24] border border-teal-500/40 text-xs text-[#0840A8] dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="teal" type="submit">
              Guardar en Expediente
            </Button>
          </div>
        </form>
      )}

      {/* CLINICAL TIMELINE */}
      <div className="relative border-l-2 border-teal-500/30 ml-4 space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="relative pl-6">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-teal-main border-2 border-white dark:border-[#07242B]" />

            <div className="bg-white dark:bg-[#072B33] border border-ocean-deep/10 dark:border-teal-500/20 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-ocean-deep/10 dark:border-teal-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    {note.servicio}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-teal-200/70 font-mono flex items-center gap-1">
                    <Calendar size={12} className="text-teal-400" />
                    {note.fecha}
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-700 dark:text-teal-100 flex items-center gap-1">
                  <Stethoscope size={13} className="text-teal-400" />
                  {note.doctor}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Diagnóstico:</strong>
                  <p className="text-slate-600 dark:text-teal-200/90">{note.diagnostico}</p>
                </div>

                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Tratamiento Ejecutado:</strong>
                  <p className="text-slate-600 dark:text-teal-200/90">{note.tratamiento}</p>
                </div>

                {note.observaciones && (
                  <div className="pt-2 border-t border-ocean-deep/10 dark:border-teal-500/15">
                    <strong className="text-teal-400 block font-bold">Indicaciones / Observaciones:</strong>
                    <p className="text-slate-500 dark:text-teal-200/80 italic">{note.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
