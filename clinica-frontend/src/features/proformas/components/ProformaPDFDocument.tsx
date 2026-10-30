import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { Proforma } from '../types/proforma';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 10,
    marginBottom: 16,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0840A8',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  proformaBadge: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  proformaTag: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  proformaNumber: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#0077D4',
    textAlign: 'right',
    marginTop: 2,
  },
  proformaDate: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'right',
  },
  statusBadge: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
    textTransform: 'uppercase',
  },
  statusBorrador: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
  },
  statusAprobado: {
    backgroundColor: '#ECFDF5',
    color: '#047857',
  },
  statusRechazado: {
    backgroundColor: '#FFF1F2',
    color: '#BE123C',
  },
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
  },
  metaCol: {
    flex: 1,
    paddingRight: 8,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
  },
  metaSubText: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 1,
  },
  tableContainer: {
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: '#334155',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 8.5,
    color: '#1E293B',
  },
  tableCellRight: {
    fontSize: 8.5,
    color: '#1E293B',
    textAlign: 'right',
  },
  colIndex: { width: '8%' },
  colServicio: { width: '52%' },
  colPrecio: { width: '15%', textAlign: 'right' },
  colDescuento: { width: '10%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },

  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  totalsBox: {
    width: '45%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalGrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#0077D4',
  },
  totalGrandLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#0840A8',
  },
  totalGrandValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0840A8',
  },

  notesContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 8,
    marginBottom: 16,
  },
  notesTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  notesBody: {
    fontSize: 8,
    color: '#334155',
    lineHeight: 1.3,
  },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7.5,
    color: '#94A3B8',
  },
});

interface ProformaPDFDocumentProps {
  proforma: Proforma;
}

export const ProformaPDFDocument: React.FC<ProformaPDFDocumentProps> = ({ proforma }) => {
  const pacienteFullName = `${proforma.nombre} ${proforma.apellido}`.trim();
  const doctorFullName = proforma.doctor
    ? `Dr(a). ${proforma.doctor.nombre} ${proforma.doctor.apellido}`
    : 'No asignado';
  const sucursalNombre = proforma.sucursal?.nombre || 'Sucursal Odonto Cool';
  const sucursalUbicacion = proforma.sucursal?.ubicacion || '';

  const subtotalBruto = (proforma.detalles || []).reduce(
    (acc, d) => acc + Number(d.precio || 0),
    0
  );
  const totalDescuentos = (proforma.detalles || []).reduce(
    (acc, d) => acc + Number(d.descuento || 0),
    0
  );

  return (
    <Document title={`Proforma-${proforma.codigo_proforma}`}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandTitle}>ODONTO COOL PRO</Text>
            <Text style={styles.brandSubtitle}>Clínica Dental & Ortodoncia Digital</Text>
            <Text style={{ fontSize: 7.5, color: '#64748B', marginTop: 2 }}>
              {sucursalNombre} • {sucursalUbicacion}
            </Text>
          </View>
          <View style={styles.proformaBadge}>
            <Text style={styles.proformaTag}>Presupuesto Odontológico</Text>
            <Text style={styles.proformaNumber}>{proforma.codigo_proforma}</Text>
            <Text style={styles.proformaDate}>
              Emisión: {String(proforma.fecha_emision).split('T')[0]} • Validez: {proforma.dias_validez} días
            </Text>
            <Text
              style={[
                styles.statusBadge,
                proforma.estado === 'Aprobado'
                  ? styles.statusAprobado
                  : proforma.estado === 'Rechazado'
                  ? styles.statusRechazado
                  : styles.statusBorrador,
              ]}
            >
              ESTADO: {proforma.estado.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* METADATA PACIENTE & DOCTOR */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Cliente / Paciente</Text>
            <Text style={styles.metaValue}>{pacienteFullName}</Text>
            <Text style={styles.metaSubText}>
              Edad: {proforma.edad} años • Sexo: {proforma.sexo === 'M' ? 'Masculino' : proforma.sexo === 'F' ? 'Femenino' : 'Otro'}
            </Text>
            <Text style={styles.metaSubText}>Celular: {proforma.celular || 'No registrado'}</Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Especialista / Emisor</Text>
            <Text style={styles.metaValue}>{doctorFullName}</Text>
            <Text style={styles.metaSubText}>
              Sede: {sucursalNombre}
            </Text>
            {proforma.domicilio_actual && (
              <Text style={styles.metaSubText}>Dirección: {proforma.domicilio_actual}</Text>
            )}
          </View>
        </View>

        {/* SERVICES TABLE */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colIndex]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colServicio]}>Tratamiento Odontológico</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrecio]}>Precio Base</Text>
            <Text style={[styles.tableHeaderCell, styles.colDescuento]}>Desc.</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
          </View>

          {(proforma.detalles || []).map((det, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colIndex]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.colServicio]}>
                {det.nombre_servicio || det.servicio?.nombre || 'Procedimiento Clínico'}
              </Text>
              <Text style={[styles.tableCellRight, styles.colPrecio]}>
                Bs. {Number(det.precio).toFixed(2)}
              </Text>
              <Text style={[styles.tableCellRight, styles.colDescuento]}>
                {Number(det.descuento) > 0 ? `-Bs. ${Number(det.descuento).toFixed(2)}` : '0.00'}
              </Text>
              <Text style={[styles.tableCellRight, styles.colTotal, { fontFamily: 'Helvetica-Bold' }]}>
                Bs. {Number(det.subtotal).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* TOTALS */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={{ fontSize: 8, color: '#64748B' }}>Subtotal Tratamientos:</Text>
              <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold' }}>
                Bs. {subtotalBruto.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={{ fontSize: 8, color: '#64748B' }}>Descuentos Especiales:</Text>
              <Text style={{ fontSize: 8.5, color: '#DC2626' }}>
                -Bs. {totalDescuentos.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalGrandRow}>
              <Text style={styles.totalGrandLabel}>Total Estimado:</Text>
              <Text style={styles.totalGrandValue}>
                Bs. {Number(proforma.monto_total).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* NOTES & OBSERVACIONES */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Plan Propuesto & Observaciones Clínicas</Text>
          <Text style={styles.notesBody}>
            {proforma.observaciones ||
              'Esta proforma incluye materiales biocompatibles de alta gama y control clínico. Los precios se mantendrán vigentes durante los días indicados en este documento.'}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ODONTO COOL PRO • Sistema de Gestión Odontológica • Cotización Informativa
          </Text>
          <Text style={styles.footerText}>Página 1 de 1</Text>
        </View>
      </Page>
    </Document>
  );
};
