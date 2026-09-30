import React, { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useExpedienteStore } from '../store/useExpedienteStore';
import api from '../../../services/api';
import type { Paciente } from '../../patients/types/patient';
import { toast } from 'sonner';

export const ExpedienteUploadForm: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [selectedSucursalId, setSelectedSucursalId] = useState<string>('');
  
  const [pacienteId, setPacienteId] = useState<string>('');
  const [titulo, setTitulo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { uploadExpediente, isLoading } = useExpedienteStore();

  useEffect(() => {
    // Fetch both pacientes and sucursales
    Promise.all([
      api.get('/pacientes'),
      api.get('/sucursales')
    ]).then(([resPacientes, resSucursales]) => {
      setPacientes(resPacientes.data.pacientes || []);
      const sucursalesData = resSucursales.data.sucursales || resSucursales.data;
      setSucursales(Array.isArray(sucursalesData) ? sucursalesData : []);
    }).catch((err) => {
      toast.error('Error al cargar datos para el formulario');
    });
  }, []);

  const pacientesFiltrados = selectedSucursalId
    ? pacientes.filter(p => p.sucursal_id.toString() === selectedSucursalId)
    : pacientes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Debes seleccionar un archivo PDF');
      return;
    }
    if (!pacienteId || !titulo || !tipoDocumento) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('paciente_id', pacienteId);
    formData.append('titulo', titulo);
    formData.append('tipo_documento', tipoDocumento);
    if (descripcion) {
      formData.append('descripcion', descripcion);
    }
    formData.append('archivo', file);

    try {
      await uploadExpediente(formData);
      toast.success('Expediente subido exitosamente');
      // Reset form
      setSelectedSucursalId('');
      setPacienteId('');
      setTitulo('');
      setTipoDocumento('');
      setDescripcion('');
      setFile(null);
    } catch (error) {
      // Error is handled in store and displayed, but we can also toast here if needed
    }
  };

  return (
    <div className="bg-white dark:bg-[#002D5E] rounded-2xl shadow-xl shadow-sm dark:shadow-[#001C3D]/50 border border-[#0840A8]/15 dark:border-[#00C2E0]/30 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-5 border-b border-[#0840A8]/15 dark:border-[#00C2E0]/30 bg-white dark:bg-[#002D5E]">
        <h2 className="text-lg font-extrabold text-[#0840A8] dark:text-white flex items-center gap-2">
          <Upload className="text-[#0077D4] dark:text-[#00C2E0]" size={20} />
          Subir Nuevo Expediente
        </h2>
      </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="expediente-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Filtro Sucursal */}
            {sucursales.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#0840A8] dark:text-blue-100">
                  Filtrar por Sucursal
                </label>
                <select
                  value={selectedSucursalId}
                  onChange={(e) => {
                    setSelectedSucursalId(e.target.value);
                    setPacienteId(''); // Reset patient when branch changes
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#0840A8]/20 dark:border-[#0077D4]/40 bg-[#F4F9FF] dark:bg-[#001C3D] text-[#0840A8] dark:text-white focus:ring-2 focus:ring-[#00C2E0]/50 outline-none transition-all"
                >
                  <option value="">Todas las sucursales...</option>
                  {sucursales.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Paciente */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0840A8] dark:text-blue-100">
                Paciente <span className="text-red-500">*</span>
              </label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#0840A8]/20 dark:border-[#0077D4]/40 bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white focus:ring-2 focus:ring-[#00C2E0]/50 outline-none transition-all"
                required
              >
                <option value="">Selecciona un paciente...</option>
                {pacientesFiltrados.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} {p.codigo_paciente ? `(${p.codigo_paciente})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0840A8] dark:text-blue-100">
                Título del Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Resultados de Sangre"
                className="w-full p-2.5 rounded-xl border border-[#0840A8]/20 dark:border-[#0077D4]/40 bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white placeholder:text-[#0840A8]/40 dark:placeholder:text-blue-200/40 focus:ring-2 focus:ring-[#00C2E0]/50 outline-none transition-all"
                required
              />
            </div>

            {/* Tipo Documento */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0840A8] dark:text-blue-100">
                Tipo de Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                placeholder="Ej. Análisis, Radiografía, Receta, etc."
                className="w-full p-2.5 rounded-xl border border-[#0840A8]/20 dark:border-[#0077D4]/40 bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white placeholder:text-[#0840A8]/40 dark:placeholder:text-blue-200/40 focus:ring-2 focus:ring-[#00C2E0]/50 outline-none transition-all"
                required
              />
            </div>

            {/* File Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0840A8] dark:text-blue-100">
                Archivo PDF <span className="text-red-500">*</span>
              </label>
              <div className="relative border-2 border-dashed border-[#0840A8]/30 dark:border-[#00C2E0]/40 rounded-xl p-6 flex flex-col items-center justify-center bg-white dark:bg-[#002D5E]/50 hover:bg-[#E5F7FF] dark:hover:bg-[#002D5E] transition-colors group">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <FileText className="text-[#0077D4] dark:text-[#00C2E0] mb-2 group-hover:scale-110 transition-transform" size={32} />
                <p className="text-sm font-medium text-[#0840A8] dark:text-blue-100 text-center">
                  {file ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{file.name}</span>
                  ) : (
                    <span>Haz clic o arrastra un archivo PDF aquí (Máx. 10MB)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#0840A8] dark:text-blue-100">
                Descripción (Opcional)
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Añade notas o detalles adicionales sobre este documento..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-[#0840A8]/20 dark:border-[#0077D4]/40 bg-white dark:bg-[#002D5E] text-[#0840A8] dark:text-white placeholder:text-[#0840A8]/40 dark:placeholder:text-blue-200/40 focus:ring-2 focus:ring-[#00C2E0]/50 outline-none transition-all resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#0840A8]/15 dark:border-[#00C2E0]/30 bg-white dark:bg-[#002D5E] flex justify-end">
          <Button type="submit" form="expediente-form" variant="teal" disabled={isLoading || !file || !pacienteId || !titulo || !tipoDocumento} className="w-full">
            {isLoading ? 'Subiendo...' : 'Subir Documento'}
          </Button>
        </div>
      </div>
  );
};
