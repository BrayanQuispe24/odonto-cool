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
      <div className="p-8 text-center text-xs text-slate-500 dark:text-teal-200/70 font-medium">
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ENFERMEDADES PREEXISTENTES */}
      <div className="bg-white dark:bg-[#072B33] border border-ocean-deep/10 dark:border-teal-500/20 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-ocean-deep/10 dark:border-teal-500/20 pb-3">
          <Activity className="text-teal-400" size={16} />
          <span>Enfermedades y Condiciones Patológicas Preexistentes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const isChecked = Boolean(antecedente[item.keyFlag as keyof Antecedente]);
            const descValue = String(antecedente[item.keyDesc as keyof Antecedente] || '');

            return (
              <div
                key={item.keyFlag}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  isChecked
                    ? 'bg-amber-950/40 dark:bg-[#133E47] border-amber-500/50'
                    : 'bg-slate-50/50 dark:bg-[#051E24] border-ocean-deep/10 dark:border-teal-500/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
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
                    <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-main"></div>
                  </label>
                </div>

                {isChecked && (
                  <input
                    type="text"
                    placeholder={`Especificar observaciones sobre ${item.label.toLowerCase()}...`}
                    value={descValue}
                    onChange={(e) => handleTextChange(item.keyDesc as keyof Antecedente, e.target.value)}
                    className="w-full mt-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#072B33] border border-amber-500/30 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ANTECEDENTES QUIRÚRGICOS Y FARMACOLÓGICOS */}
      <div className="bg-white dark:bg-[#072B33] border border-ocean-deep/10 dark:border-teal-500/20 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-ocean-deep/10 dark:border-teal-500/20 pb-3">
          <ShieldAlert className="text-teal-400" size={16} />
          <span>Antecedentes Farmacológicos, Quirúrgicos y Estado Fisiológico</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medicamentos */}
          <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-[#051E24] border border-ocean-deep/10 dark:border-teal-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                💊 ¿Toma actualmente algún medicamento?
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.esta_tomando_algun_medicamento)}
                onChange={() => handleToggle('esta_tomando_algun_medicamento')}
                className="rounded text-teal-main focus:ring-teal-main cursor-pointer"
              />
            </div>
            {antecedente.esta_tomando_algun_medicamento && (
              <input
                type="text"
                placeholder="Nombre de medicamentos y dosis..."
                value={antecedente.descripcion_medicamentos || ''}
                onChange={(e) => handleTextChange('descripcion_medicamentos', e.target.value)}
                className="w-full mt-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#072B33] border border-teal-500/30 text-xs text-[#0840A8] dark:text-white"
              />
            )}
          </div>

          {/* Intervenciones Quirúrgicas */}
          <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-[#051E24] border border-ocean-deep/10 dark:border-teal-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🏥 ¿Ha sido intervenido quirúrgicamente?
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.lo_han_intervenido_quirurgicamente)}
                onChange={() => handleToggle('lo_han_intervenido_quirurgicamente')}
                className="rounded text-teal-main focus:ring-teal-main cursor-pointer"
              />
            </div>
            {antecedente.lo_han_intervenido_quirurgicamente && (
              <input
                type="text"
                placeholder="Detalles de cirugías previas..."
                value={antecedente.descripcion_intervencion || ''}
                onChange={(e) => handleTextChange('descripcion_intervencion', e.target.value)}
                className="w-full mt-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#072B33] border border-teal-500/30 text-xs text-[#0840A8] dark:text-white"
              />
            )}
          </div>

          {/* Atendido por otro doctor */}
          <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-[#051E24] border border-ocean-deep/10 dark:border-teal-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                👨‍⚕️ ¿Está siendo atendido por otro médico?
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.esta_siendo_atendido_por_otro_doctor)}
                onChange={() => handleToggle('esta_siendo_atendido_por_otro_doctor')}
                className="rounded text-teal-main focus:ring-teal-main cursor-pointer"
              />
            </div>
          </div>

          {/* Embarazo */}
          <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-[#051E24] border border-ocean-deep/10 dark:border-teal-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                🤰 ¿Se encuentra actualmente embarazada?
              </span>
              <input
                type="checkbox"
                checked={Boolean(antecedente.esta_embarazada)}
                onChange={() => handleToggle('esta_embarazada')}
                className="rounded text-teal-main focus:ring-teal-main cursor-pointer"
              />
            </div>
            {antecedente.esta_embarazada && (
              <input
                type="text"
                placeholder="Semanas/meses de gestación..."
                value={antecedente.descripcion_embarazo || ''}
                onChange={(e) => handleTextChange('descripcion_embarazo', e.target.value)}
                className="w-full mt-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#072B33] border border-teal-500/30 text-xs text-[#0840A8] dark:text-white"
              />
            )}
          </div>

          {/* Otros antecedentes */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-teal-100 mb-1">
              Otras observaciones o hábitos (Tabaco, Alcohol, etc.)
            </label>
            <textarea
              rows={3}
              value={antecedente.otros || ''}
              onChange={(e) => handleTextChange('otros', e.target.value)}
              placeholder="Notas clínicas adicionales sobre antecedentes del paciente..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#051E24] border border-ocean-deep/20 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-main/50"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end pt-2">
        <Button variant="teal" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando Antecedentes...' : 'Actualizar Antecedentes Clínicos'}
        </Button>
      </div>
    </form>
  );
};
