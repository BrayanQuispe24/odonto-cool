import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Paciente } from '../types/patient';
import type { Antecedente } from '../types/antecedente';
import type { Expediente } from '../../expedientes/types/expediente';
import type { BoletaServicioPrestado } from '../../boletas/types/boleta';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 6.5,
    fontFamily: 'Helvetica',
    color: '#334155',
    backgroundColor: '#FFFFFF',
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: 15.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0840A8', // Dark blue primary
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 6.5,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 5.5,
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0077D4', // Primary blue
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 6,
    width: '100%',
  },

  // Cards (Instead of rigid grids)
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 12,
  },

  gridRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  gridRowLast: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  gridCol3: { width: '33.33%', paddingRight: 8 },
  gridCol4: { width: '25%', paddingRight: 8 },
  gridCol2: { width: '50%', paddingRight: 8 },
  gridCol1: { width: '100%' },

  label: {
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  value: {
    fontSize: 6.5,
    color: '#0F172A',
  },

  // Tables
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCell: {
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableRowLast: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  col15: { width: '15%', paddingRight: 8 },
  col20: { width: '20%', paddingRight: 8 },
  col25: { width: '25%', paddingRight: 8 },
  col40: { width: '40%' },
  col45: { width: '45%', paddingRight: 8 },

  // Details
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
  },
  detailValue: {
    color: '#475569',
  },
  obs: {
    color: '#64748B',
    fontStyle: 'italic',
    fontSize: 5.5,
    marginTop: 2,
  },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 5.5,
    color: '#94A3B8',
  },
});

interface HistorialPDFDocumentProps {
  patient: Paciente;
  boletas: BoletaServicioPrestado[];
  antecedente?: Partial<Antecedente>;
  expedientes?: Expediente[];
}

export const HistorialPDFDocument: React.FC<HistorialPDFDocumentProps> = ({ patient, boletas = [], antecedente, expedientes = [] }) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return dateString.split('T')[0].split('-').reverse().join('/');
    } catch {
      return dateString;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER BRAND */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandTitle}>ODONTO COOL</Text>
            <Text style={styles.brandSubtitle}>Historial Clínico de Paciente</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Impreso: {currentDate}</Text>
          </View>
        </View>

        {/* FICHA & DATOS PERSONALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Datos Filiatorios & Personales</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.card}>
            <View style={styles.gridRow}>
              <View style={styles.gridCol4}>
                <Text style={styles.label}>Código</Text>
                <Text style={styles.value}>{patient.codigo_paciente}</Text>
              </View>
              <View style={styles.gridCol2}>
                <Text style={styles.label}>Sucursal</Text>
                <Text style={styles.value}>{patient.sucursal?.ubicacion || patient.sucursal?.nombre || 'General'}</Text>
              </View>
              <View style={styles.gridCol4}>
                <Text style={styles.label}>F. Nacimiento</Text>
                <Text style={styles.value}>{formatDate(patient.fecha_nacimiento)}</Text>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridCol2}>
                <Text style={styles.label}>Nombres y Apellidos</Text>
                <Text style={styles.value}>{patient.nombre} {patient.apellido}</Text>
              </View>
              <View style={styles.gridCol4}>
                <Text style={styles.label}>Edad</Text>
                <Text style={styles.value}>{patient.edad} años</Text>
              </View>
              <View style={styles.gridCol4}>
                <Text style={styles.label}>Sexo</Text>
                <Text style={styles.value}>{patient.sexo}</Text>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridCol4}>
                <Text style={styles.label}>Estado Civil</Text>
                <Text style={styles.value}>{patient.estado_civil || '-'}</Text>
              </View>
              <View style={styles.gridCol4}>
                <Text style={styles.label}>Celular</Text>
                <Text style={styles.value}>{patient.celular || '-'}</Text>
              </View>
              <View style={styles.gridCol2}>
                <Text style={styles.label}>Ocupación</Text>
                <Text style={styles.value}>{patient.ocupacion || '-'}</Text>
              </View>
            </View>

            <View style={styles.gridRowLast}>
              <View style={styles.gridCol1}>
                <Text style={styles.label}>Domicilio Actual</Text>
                <Text style={styles.value}>{patient.domicilio_actual || '-'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CONTACTO DE EMERGENCIA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.card}>
            <View style={styles.gridRowLast}>
              <View style={styles.gridCol3}>
                <Text style={styles.label}>Nombre del Contacto</Text>
                <Text style={styles.value}>{patient.nombre_contacto_emergencia || '-'} {patient.apellido_contacto_emergencia || ''}</Text>
              </View>
              <View style={styles.gridCol3}>
                <Text style={styles.label}>Parentesco</Text>
                <Text style={styles.value}>{patient.parentesco_contacto_emergencia || '-'}</Text>
              </View>
              <View style={styles.gridCol3}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{patient.telefono_emergencia || '-'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ANTECEDENTES */}
        {antecedente && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Antecedentes Médicos & Alergias</Text>
              <View style={styles.sectionDivider} />
            </View>
            <View style={styles.card}>
              <View style={styles.gridRow}>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Diabetes</Text>
                  <Text style={styles.value}>{antecedente.tiene_diabetes ? `Sí - ${antecedente.descripcion_diabetes || 'Sin detalles'}` : 'No'}</Text>
                </View>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Hipertensión Arterial</Text>
                  <Text style={styles.value}>{antecedente.tiene_hipertencion ? `Sí - ${antecedente.descripcion_hipertencion || 'Sin detalles'}` : 'No'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Cáncer / Oncológico</Text>
                  <Text style={styles.value}>{antecedente.tiene_cancer ? `Sí - ${antecedente.descripcion_cancer || 'Sin detalles'}` : 'No'}</Text>
                </View>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Reumatismo / Artritis</Text>
                  <Text style={styles.value}>{antecedente.tiene_reumatismo ? `Sí - ${antecedente.descripcion_reumatismo || 'Sin detalles'}` : 'No'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Alergias Medicamentosas / Anestesia</Text>
                  <Text style={styles.value}>{antecedente.tiene_alergias ? `Sí - ${antecedente.descripcion_alergias || 'Sin detalles'}` : 'No'}</Text>
                </View>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Gastritis / Úlceras</Text>
                  <Text style={styles.value}>{antecedente.tiene_gastritis ? `Sí - ${antecedente.descripcion_gastritis || 'Sin detalles'}` : 'No'}</Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 }} />

              <View style={styles.gridRow}>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Toma Algún Medicamento</Text>
                  <Text style={styles.value}>{antecedente.esta_tomando_algun_medicamento ? `Sí - ${antecedente.descripcion_medicamentos || 'Sin detalles'}` : 'No'}</Text>
                </View>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Intervenciones Quirúrgicas</Text>
                  <Text style={styles.value}>{antecedente.lo_han_intervenido_quirurgicamente ? `Sí - ${antecedente.descripcion_intervencion || 'Sin detalles'}` : 'No'}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Atendido por Otro Médico</Text>
                  <Text style={styles.value}>{antecedente.esta_siendo_atendido_por_otro_doctor ? 'Sí' : 'No'}</Text>
                </View>
                <View style={styles.gridCol2}>
                  <Text style={styles.label}>Paciente Embarazada</Text>
                  <Text style={styles.value}>{antecedente.esta_embarazada ? `Sí - ${antecedente.descripcion_embarazo || 'Sin detalles'}` : 'No'}</Text>
                </View>
              </View>
              <View style={styles.gridRowLast}>
                <View style={styles.gridCol1}>
                  <Text style={styles.label}>Otras observaciones o hábitos</Text>
                  <Text style={styles.value}>{antecedente.otros || 'Ninguna'}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* HISTORIAL TABLE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historial & Evolución Clínica (Facturado)</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col15]}>Fecha</Text>
              <Text style={[styles.tableHeaderCell, styles.col25]}>Doctor</Text>
              <Text style={[styles.tableHeaderCell, { width: '60%' }]}>Servicios / Tratamientos</Text>
            </View>

            {boletas.map((boleta, idx) => {
              const isLast = idx === boletas.length - 1;
              const docName = boleta.doctor
                ? `${boleta.doctor.nombre} ${boleta.doctor.apellido}`
                : boleta.cita?.doctor
                  ? `${boleta.cita.doctor.nombre} ${boleta.cita.doctor.apellido}`
                  : 'Sin especificar';
              return (
                <View key={boleta.id} style={isLast ? styles.tableRowLast : styles.tableRow}>
                  <Text style={[styles.value, styles.col15]}>{String(boleta.fecha_emision).split('T')[0]}</Text>
                  <Text style={[styles.value, styles.col25]}>{docName}</Text>
                  <View style={{ width: '60%' }}>
                    {boleta.detalles && boleta.detalles.length > 0 ? (
                      boleta.detalles.map((det, dIdx) => (
                        <View key={dIdx} style={styles.detailRow}>
                          <Text style={styles.detailValue}>
                            • {det.servicio?.nombre || det.descripcion || 'Tratamiento General'}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.detailValue}>Sin detalles</Text>
                    )}
                  </View>
                </View>
              );
            })}

            {boletas.length === 0 && (
              <View style={[styles.tableRowLast, { justifyContent: 'center' }]}>
                <Text style={{ color: '#64748B', fontSize: 6.5 }}>No hay servicios facturados registrados.</Text>
              </View>
            )}
          </View>
        </View>

        {/* EXPEDIENTES ADJUNTOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Documentos Médicos y Radiografías</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col15]}>Fecha</Text>
              <Text style={[styles.tableHeaderCell, styles.col45]}>Documento</Text>
              <Text style={[styles.tableHeaderCell, styles.col40]}>Tipo</Text>
            </View>
            {expedientes.map((exp, idx) => {
              const isLast = idx === expedientes.length - 1;
              return (
                <View key={exp.id} style={isLast ? styles.tableRowLast : styles.tableRow}>
                  <Text style={[styles.value, styles.col15]}>{new Date(exp.created_at).toLocaleDateString()}</Text>
                  <Text style={[styles.value, styles.col45]}>{exp.titulo}</Text>
                  <Text style={[styles.value, styles.col40]}>{exp.tipo_documento}</Text>
                </View>
              );
            })}
            {expedientes.length === 0 && (
              <View style={[styles.tableRowLast, { justifyContent: 'center' }]}>
                <Text style={{ color: '#64748B', fontSize: 6.5 }}>No hay archivos adjuntos.</Text>
              </View>
            )}
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generado desde el Sistema de Gestión Odonto Cool Pro
          </Text>
        </View>
      </Page>
    </Document>
  );
};

