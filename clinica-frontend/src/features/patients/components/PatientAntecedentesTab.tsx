import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import type { Antecedente } from '../types/antecedente';
import { getAntecedentesApi, updateAntecedentesApi } from '../services/patientService';

interface PatientAntecedentesTabProps {
  patientId: number;
}

export const PatientAntecedentesTab: React.FC<PatientAntecedentesTabProps> = ({ patientId }) => {
  const [antecedente, setAntecedente] = useState<Partial<Antecedente>>({
    tiene_diabetes: false,
    descripcion_diabetes: '',
    tiene_hipertencion: false,
    descripcion_hipertencion: '',
    tiene_cancer: false,
    descripcion_cancer: '',
    tiene_reumatismo: false,
    descripcion_reumatismo: '',
    tiene_alergias: false,
    descripcion_alergias: '',
    tiene_gastritis: false,
    descripcion_gastritis: '',
    otros: '',
    esta_siendo_atendido_por_otro_doctor: false,
    esta_tomando_algun_medicamento: false,
    descripcion_medicamentos: '',
    lo_han_intervenido_quirurgicamente: false,
    descripcion_intervencion: '',
    esta_embarazada: false,
    descripcion_embarazo: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAntecedentesApi(patientId)
      .then((data) => {
        setAntecedente(data || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [patientId]);

  const handleToggle = (field: keyof Antecedente) => {
    setAntecedente((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTextChange = (field: keyof Antecedente, value: string) => {
    setAntecedente((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await updateAntecedentesApi(patientId, antecedente);
      const msg = 'Antecedentes médicos actualizados correctamente';
      setSuccessMsg(msg);
      toast.success(msg);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Error al actualizar antecedentes.';
      setErrorMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-small text-slate-500 dark:text-slate-400 font-medium">
        Cargando historial de antecedentes clínicos...
      </div>
    );
  }

  const items = [
    { keyFlag: 'tiene_diabetes', keyDesc: 'descripcion_diabetes', label: 'Diabetes', icon: '🩸' },
    { keyFlag: 'tiene_hipertencion', keyDesc: 'descripcion_hipertencion', label: 'Hipertensión Arterial', icon: '🫀' },
    { keyFlag: 'tiene_cancer', keyDesc: 'descripcion_cancer', label: 'Cáncer / Historial Oncológico', icon: '🎗️' },
    { keyFlag: 'tiene_reumatismo', keyDesc: 'descripcion_reumatismo', label: 'Reumatismo / Artritis', icon: '🦴' },
    { keyFlag: 'tiene_alergias', keyDesc: 'descripcion_alergias', label: 'Alergias Medicamentosas / Anestesia', icon: '⚠️' },
    { keyFlag: 'tiene_gastritis', keyDesc: 'descripcion_gastritis', label: 'Gastritis / Úlceras', icon: '🧪' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMsg && (
        <div className="p-2.5 rounded-sm bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-small font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-sm bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-small font-bold flex items-center gap-2 shadow-sm">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ENFERMEDADES PREEXISTENTES */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-4 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Activity className="text-primary dark:text-secondary" size={14} />
          <span>Enfermedades y Condiciones Patológicas Preexistentes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => {
            const isChecked = Boolean(antecedente[item.keyFlag as keyof Antecedente]);
            const descValue = String(antecedente[item.keyDesc as keyof Antecedente] || '');

            return (
              <div
                key={item.keyFlag}
                className={`p-2.5 rounded-sm border transition-all duration-200 ${
                  isChecked
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50'
                    : 'bg-slate-50 dark:bg-dark-bg border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-small font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(item.keyFlag as keyof Antecedente)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#0077D4]"></div>
                  </label>
                </div>

                {isChecked && (
                  <input
                    type="text"
                    placeholder={`Especificar observaciones sobre ${item.label.toLowerCase()}...`}
                    value={descValue}
                    onChange={(e) => handleTextChange(item.keyDesc as keyof Antecedente, e.target.value)}
                    className="w-full mt-2 px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-primary-dark dark:text-white text-small placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ANTECEDENTES QUIRÚRGICOS Y FARMACOLÓGICOS */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-sm p-4 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-slate-300 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <ShieldAlert className="text-primary dark:text-secondary" size={14} />
          <span>Antecedentes Farmacológicos, Quirúrgicos y Estado Fisiológico</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Medicamentos */}
          <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-small font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                💊 Toma algún medicamento
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.esta_tomando_algun_medicamento)}
                onChange={() => handleToggle('esta_tomando_algun_medicamento')}
                className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            {antecedente.esta_tomando_algun_medicamento && (
              <input
                type="text"
                placeholder="Nombre de medicamentos y dosis..."
                value={antecedente.descripcion_medicamentos || ''}
                onChange={(e) => handleTextChange('descripcion_medicamentos', e.target.value)}
                className="w-full mt-2 px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-small text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            )}
          </div>

          {/* Intervenciones Quirúrgicas */}
          <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-small font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                🏥 Intervenciones quirúrgicas
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.lo_han_intervenido_quirurgicamente)}
                onChange={() => handleToggle('lo_han_intervenido_quirurgicamente')}
                className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            {antecedente.lo_han_intervenido_quirurgicamente && (
              <input
                type="text"
                placeholder="Detalles de cirugías previas..."
                value={antecedente.descripcion_intervencion || ''}
                onChange={(e) => handleTextChange('descripcion_intervencion', e.target.value)}
                className="w-full mt-2 px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-small text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            )}
          </div>

          {/* Atendido por otro doctor */}
          <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-small font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                👨‍⚕️ Atendido por otro médico
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.esta_siendo_atendido_por_otro_doctor)}
                onChange={() => handleToggle('esta_siendo_atendido_por_otro_doctor')}
                className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Embarazo */}
          <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-small font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                🤰 Paciente embarazada
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.esta_embarazada)}
                onChange={() => handleToggle('esta_embarazada')}
                className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
            {antecedente.esta_embarazada && (
              <input
                type="text"
                placeholder="Semanas/meses de gestación..."
                value={antecedente.descripcion_embarazo || ''}
                onChange={(e) => handleTextChange('descripcion_embarazo', e.target.value)}
                className="w-full mt-2 px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-small text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            )}
          </div>

          {/* Otros antecedentes */}
          <div className="md:col-span-2 mt-2">
            <label className="block text-small font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Otras observaciones o hábitos (Tabaco, Alcohol, etc.)
            </label>
            <textarea
              rows={2}
              value={antecedente.otros || ''}
              onChange={(e) => handleTextChange('otros', e.target.value)}
              placeholder="Notas clínicas adicionales..."
              className="w-full px-2.5 py-1.5 rounded-sm bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-700 text-small text-primary-dark dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-1.5 rounded bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold transition-all shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Actualizar Antecedentes Clínicos'}
        </button>
      </div>
    </form>
  );
};
