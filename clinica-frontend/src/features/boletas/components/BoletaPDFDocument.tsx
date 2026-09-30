import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { BoletaServicioPrestado } from '../types/boleta';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  // Executive Header section
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#002D5E',
    borderBottomStyle: 'solid',
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
    color: '#002D5E',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 8,
    color: '#475569',
    marginTop: 3,
    textTransform: 'uppercase',
  },
  boletaBadge: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  boletaNumber: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#002D5E',
    textAlign: 'right',
  },
  boletaDate: {
    fontSize: 8.5,
    color: '#334155',
    marginTop: 3,
    textAlign: 'right',
  },

  // Metadata Grid (Sharp rectangular card)
  metaGrid: {
    flexDirection: 'row',
    justify: 'space-between',
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
    borderWidth: 1,
    borderRadius: 0,
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
    color: '#002D5E',
    textTransform: 'uppercase',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  metaSubText: {
    fontSize: 8,
    color: '#334155',
    marginTop: 2,
  },

  // Table styles (Strict grid rectangular)
  tableContainer: {
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 0,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#002D5E',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 0,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 0,
  },
  tableRowEven: {
    backgroundColor: '#F1F5F9',
  },
  colIndex: { width: '5%' },
  colDesc: { width: '40%' },
  colPieza: { width: '20%' },
  colPrecio: { width: '12%', textAlign: 'right' },
  colDescMonto: { width: '11%', textAlign: 'right' },
  colTotal: { width: '12%', textAlign: 'right' },

  // Totals section (Rectangular cards)
  summaryContainer: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'stretch',
    marginBottom: 16,
  },
  paymentInfoCard: {
    width: '49%',
    backgroundColor: '#F8FAFC',
    borderRadius: 0,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  infoTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#002D5E',
    marginBottom: 6,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 3,
  },
  infoText: {
    fontSize: 8,
    color: '#334155',
    marginBottom: 3,
  },
  totalsCard: {
    width: '49%',
    backgroundColor: '#002D5E',
    borderRadius: 0,
    padding: 10,
    color: '#FFFFFF',
    textAlign: 'right',
    justifyContent: 'center',
  },
  subtotalRow: {
    fontSize: 8.5,
    color: '#94A3B8',
    marginBottom: 3,
  },
  totalBig: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 4,
  },

  // Commission & Lab box (Rectangular)
  financialGrid: {
    flexDirection: 'row',
    justify: 'space-between',
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
    borderWidth: 1,
    borderRadius: 0,
    padding: 8,
    marginBottom: 20,
  },
  finCol: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  finColLast: {
    flex: 1,
    textAlign: 'center',
  },
  finLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    textTransform: 'uppercase',
  },
  finVal: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#002D5E',
    marginTop: 2,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#64748B',
    fontFamily: 'Helvetica',
  },
});

interface BoletaPDFDocumentProps {
  boleta: BoletaServicioPrestado;
}

export const BoletaPDFDocument: React.FC<BoletaPDFDocumentProps> = ({ boleta }) => {
  const pac = boleta.cita?.paciente;
  const pacName = pac
    ? `${pac.nombre} ${pac.apellido}`
    : boleta.cita?.nombre_paciente_unregistered || 'Paciente General';
  const hc = pac?.codigo_paciente || 'N/A';

  const doc = boleta.doctor || boleta.cita?.doctor;
  const docName = doc ? `Dr. ${doc.nombre} ${doc.apellido}` : 'Sin doctor asignado';

  const subtotalSum = (boleta.detalles || []).reduce(
    (acc, d) => acc + Number(d.servicio?.precio || 0),
    0
  );
  const descuentoSum = (boleta.detalles || []).reduce(
    (acc, d) => acc + Number(d.descuento || 0),
    0
  );

  const cuota1 = boleta.cuotas?.[0];
  const cuota2 = boleta.cuotas?.[1];

  const cuenta1Monto = cuota1 ? Number(cuota1.monto_cuota) : Number(boleta.monto_total);
  const cuenta1Metodo = cuota1?.metodo_pago || boleta.metodo_pago || 'EFEC';

  const cuenta2Monto = cuota2 ? Number(cuota2.monto_cuota) : 0;
  const cuenta2Fecha = cuota2?.fecha_pago ? String(cuota2.fecha_pago).split('T')[0] : '-';
  const cuenta2Metodo = cuota2?.metodo_pago || '-';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER BRAND */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandTitle}>ODONTO COOL PRO</Text>
            <Text style={styles.brandSubtitle}>
              Clínica Odontológica Especializada • Boleta Oficial de Venta
            </Text>
          </View>
          <View style={styles.boletaBadge}>
            <Text style={styles.boletaNumber}>Nº {boleta.numero_boleta}</Text>
            <Text style={styles.boletaDate}>
              Fecha Emisión: {String(boleta.fecha_emision).split('T')[0]}
            </Text>
          </View>
        </View>

        {/* METADATA GRID */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Paciente / HC</Text>
            <Text style={styles.metaValue}>{pacName}</Text>
            <Text style={styles.metaSubText}>Historia Clínica: {hc}</Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Doctor Tratante</Text>
            <Text style={styles.metaValue}>{docName}</Text>
            <Text style={styles.metaSubText}>Emitido por: {boleta.emitido_por}</Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Cita & Estado</Text>
            <Text style={styles.metaValue}>Cita #{boleta.cita?.numero_cita || boleta.cita_id}</Text>
            <Text style={styles.metaSubText}>
              Estado: {boleta.estado === 'completado' ? 'COMPLETADO' : 'PENDIENTE'}
            </Text>
          </View>
        </View>

        {/* SERVICES TABLE */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colIndex]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Servicio Prestado</Text>
            <Text style={[styles.tableHeaderCell, styles.colPieza]}>Pieza Dental</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrecio]}>Precio</Text>
            <Text style={[styles.tableHeaderCell, styles.colDescMonto]}>Desc.</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Neto</Text>
          </View>

          {(boleta.detalles || []).map((det, idx) => {
            const p = Number(det.servicio?.precio || 0);
            const d = Number(det.descuento || 0);
            const lineNet = Math.max(0, p - d);
            const isEven = idx % 2 === 1;

            return (
              <View key={idx} style={[styles.tableRow, isEven ? styles.tableRowEven : {}]}>
                <Text style={styles.colIndex}>{idx + 1}</Text>
                <Text style={styles.colDesc}>
                  {det.servicio?.nombre || det.descripcion || 'Tratamiento Odontológico'}
                </Text>
                <Text style={styles.colPieza}>
                  {det.diente ? `FDI #${det.diente.numero_diente} (${det.diente.nombre})` : 'General'}
                </Text>
                <Text style={styles.colPrecio}>Bs. {p.toFixed(2)}</Text>
                <Text style={styles.colDescMonto}>Bs. {d.toFixed(2)}</Text>
                <Text style={[styles.colTotal, { fontFamily: 'Helvetica-Bold' }]}>
                  Bs. {lineNet.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* SUMMARY & PAYMENTS */}
        <View style={styles.summaryContainer}>
          <View style={styles.paymentInfoCard}>
            <Text style={styles.infoTitle}>Detalle de Cobro y Abonos</Text>
            <Text style={styles.infoText}>Tipo de Pago: {boleta.tipo_paga || boleta.tipo_pago || 'Contado'}</Text>
            <Text style={styles.infoText}>
              Cuota 1 (Primer Abono): Bs. {cuenta1Monto.toFixed(2)} [{cuenta1Metodo}]
            </Text>
            {cuenta2Monto > 0 && (
              <Text style={styles.infoText}>
                Cuota 2 (Segundo Abono): Bs. {cuenta2Monto.toFixed(2)} [{cuenta2Metodo}] el {cuenta2Fecha}
              </Text>
            )}
          </View>

          <View style={styles.totalsCard}>
            <Text style={styles.subtotalRow}>Subtotal: Bs. {subtotalSum.toFixed(2)}</Text>
            <Text style={styles.subtotalRow}>Descuentos: Bs. {descuentoSum.toFixed(2)}</Text>
            <Text style={styles.totalBig}>TOTAL: Bs. {Number(boleta.monto_total).toFixed(2)}</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Gracias por confiar en ODONTO COOL • Comprobante emitido conforme a normas de atención odontológica
          </Text>
        </View>
      </Page>
    </Document>
  );
};
