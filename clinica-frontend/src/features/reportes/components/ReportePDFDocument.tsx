import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { ReporteFinancieroResponse, ReporteFiltros } from '../types/reporteTypes';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#002D5E',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002D5E',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#00C2E0',
    marginTop: 2,
    fontWeight: 'bold',
  },
  metaSection: {
    flexDirection: 'row',
    justify: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaCol: {
    width: '48%',
  },
  metaText: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#002D5E',
    marginBottom: 6,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justify: 'space-between',
    marginBottom: 12,
  },
  kpiCard: {
    width: '31%',
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#002D5E',
  },
  kpiCardCyan: {
    borderLeftColor: '#00C2E0',
  },
  kpiCardEmerald: {
    borderLeftColor: '#10B981',
  },
  kpiCardAmber: {
    borderLeftColor: '#F59E0B',
  },
  kpiCardRose: {
    borderLeftColor: '#F43F5E',
  },
  kpiLabel: {
    fontSize: 7,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#002D5E',
    marginTop: 3,
  },
  table: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#002D5E',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tableCell: {
    fontSize: 8,
    color: '#334155',
  },
  colBoleta: { width: '12%' },
  colFecha: { width: '10%' },
  colPaciente: { width: '20%' },
  colDoctor: { width: '18%' },
  colSucursal: { width: '12%' },
  colMonto: { width: '14%', textAlign: 'right' },
  colEstado: { width: '14%', textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justify: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 5,
  },
  footerText: {
    fontSize: 7,
    color: '#94A3B8',
  },
});

interface Props {
  data: ReporteFinancieroResponse;
  filtros: ReporteFiltros;
  sucursalNombre?: string;
  doctorNombre?: string;
}

export const ReportePDFDocument: React.FC<Props> = ({
  data,
  filtros,
  sucursalNombre,
  doctorNombre,
}) => {
  const formatBs = (amount: number) => `Bs. ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Reporte General Financiero & Ventas</Text>
          <Text style={styles.subtitle}>SISTEMA DE GESTIÓN CLÍNICA DENTAL</Text>
        </View>

        {/* METADATA & FILTERS */}
        <View style={styles.metaSection}>
          <View style={styles.metaCol}>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Fecha Emisión Reporte: </Text>
              {new Date().toLocaleDateString('es-ES')} {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Rango Filtrado: </Text>
              {filtros.fecha_inicio || 'Inicio'} al {filtros.fecha_fin || 'Actual'}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Sucursal: </Text>
              {sucursalNombre || 'Todas las sucursales'}
            </Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Doctor: </Text>
              {doctorNombre || 'Todos los doctores'}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Tipo / Método Pago: </Text>
              {filtros.tipo_pago ? filtros.tipo_pago.toUpperCase() : 'Todos'} / {filtros.metodo_pago ? filtros.metodo_pago.toUpperCase() : 'Todos'}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Estado Boleta: </Text>
              {filtros.estado ? (filtros.estado === 'completado' ? 'Completado' : 'Pendiente') : 'Todos los estados'}
            </Text>
          </View>
        </View>

        {/* KPIS / RESUMEN */}
        <Text style={styles.sectionTitle}>Resumen Ejecutivo & Indicadores (KPIs)</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Total Facturado (Generado)</Text>
            <Text style={styles.kpiValue}>{formatBs(data.resumen.monto_total_generado)}</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardEmerald]}>
            <Text style={styles.kpiLabel}>Total Cobrado (Recaudado)</Text>
            <Text style={styles.kpiValue}>{formatBs(data.resumen.monto_total_cobrado)}</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardAmber]}>
            <Text style={styles.kpiLabel}>Saldo Pendiente Cobro</Text>
            <Text style={styles.kpiValue}>{formatBs(data.resumen.monto_total_pendiente)}</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardCyan]}>
            <Text style={styles.kpiLabel}>Comisiones Odontólogos</Text>
            <Text style={styles.kpiValue}>{formatBs(data.resumen.monto_comisiones_dr)}</Text>
          </View>
          <View style={[styles.kpiCard, styles.kpiCardRose]}>
            <Text style={styles.kpiLabel}>Costos Laboratorio</Text>
            <Text style={styles.kpiValue}>{formatBs(data.resumen.monto_costo_laboratorio)}</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Ganancia Neta Estimada</Text>
            <Text style={styles.kpiValue}>{formatBs(data.resumen.ganancia_neta_estimada)}</Text>
          </View>
        </View>

        {/* DESGLOSE POR DOCTOR */}
        {data.desglose_doctores.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Rendimiento Financiero por Doctor</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Doctor</Text>
                <Text style={[styles.tableHeaderCell, { width: '15%', textAlign: 'center' }]}>Boletas</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%', textAlign: 'right' }]}>Generado</Text>
                <Text style={[styles.tableHeaderCell, { width: '18%', textAlign: 'right' }]}>Cobrado</Text>
                <Text style={[styles.tableHeaderCell, { width: '17%', textAlign: 'right' }]}>Comisión</Text>
              </View>
              {data.desglose_doctores.map((doc, idx) => (
                <View key={doc.doctor_id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                  <Text style={[styles.tableCell, { width: '30%', fontWeight: 'bold' }]}>{doc.nombre_doctor}</Text>
                  <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>{doc.total_boletas}</Text>
                  <Text style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}>{formatBs(doc.monto_total_generado)}</Text>
                  <Text style={[styles.tableCell, { width: '18%', textAlign: 'right' }]}>{formatBs(doc.monto_total_cobrado)}</Text>
                  <Text style={[styles.tableCell, { width: '17%', textAlign: 'right' }]}>{formatBs(doc.comisiones_totales)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* DETALLE BOLETAS */}
        <Text style={styles.sectionTitle}>Detalle de Boletas Emitidas ({data.boletas.length})</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colBoleta]}>Boleta</Text>
            <Text style={[styles.tableHeaderCell, styles.colFecha]}>Fecha</Text>
            <Text style={[styles.tableHeaderCell, styles.colPaciente]}>Paciente</Text>
            <Text style={[styles.tableHeaderCell, styles.colDoctor]}>Doctor</Text>
            <Text style={[styles.tableHeaderCell, styles.colSucursal]}>Sucursal</Text>
            <Text style={[styles.tableHeaderCell, styles.colMonto]}>Monto Total</Text>
            <Text style={[styles.tableHeaderCell, styles.colEstado]}>Estado</Text>
          </View>

          {data.boletas.slice(0, 25).map((b, idx) => {
            const pacienteNombre = b.cita?.paciente
              ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
              : b.cita?.nombre_paciente_unregistered || 'Paciente';

            const doctorNombre = b.doctor
              ? `${b.doctor.nombre} ${b.doctor.apellido}`
              : b.cita?.doctor
              ? `${b.cita.doctor.nombre} ${b.cita.doctor.apellido}`
              : 'N/A';

            return (
              <View key={b.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                <Text style={[styles.tableCell, styles.colBoleta, { fontWeight: 'bold' }]}>
                  {b.numero_boleta || `BOL-${b.id}`}
                </Text>
                <Text style={[styles.tableCell, styles.colFecha]}>
                  {b.fecha_emision ? new Date(b.fecha_emision).toLocaleDateString('es-ES') : '-'}
                </Text>
                <Text style={[styles.tableCell, styles.colPaciente]}>{pacienteNombre}</Text>
                <Text style={[styles.tableCell, styles.colDoctor]}>{doctorNombre}</Text>
                <Text style={[styles.tableCell, styles.colSucursal]}>{b.cita?.sucursal?.nombre || 'Central'}</Text>
                <Text style={[styles.tableCell, styles.colMonto, { fontWeight: 'bold' }]}>
                  {formatBs(Number(b.monto_total) || 0)}
                </Text>
                <Text style={[styles.tableCell, styles.colEstado]}>
                  {b.estado === 'completado' ? 'Completado' : 'Pendiente'}
                </Text>
              </View>
            );
          })}
        </View>

        {data.boletas.length > 25 && (
          <Text style={{ fontSize: 7, color: '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
            * Mostrando primeras 25 boletas en la vista previa impresiva PDF. Para el listado completo utilice la descarga en Excel.
          </Text>
        )}

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Reporte confidencial - Generado por Sistema Clínico Dental</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
