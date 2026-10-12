import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { BoletaServicioPrestado } from '../types/boleta';

// Register standard fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#334155', // slate-700
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // slate-200
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A', // slate-900
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B', // slate-500
    marginTop: 4,
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC', // slate-50
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1', // slate-300
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#475569', // slate-600
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0', // slate-200
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 9,
  },
  colBoleta: { width: '12%' },
  colFecha: { width: '12%' },
  colPaciente: { width: '25%' },
  colEstado: { width: '11%' },
  colPago: { width: '10%' },
  colTotal: { width: '15%', textAlign: 'right' },
  colComision: { width: '15%', textAlign: 'right' },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC', // slate-50
    borderTopWidth: 2,
    borderTopColor: '#94A3B8', // slate-400
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#0F172A',
  },
  footerTextRight: {
    textAlign: 'right',
  },
});

interface BoletasListPDFDocumentProps {
  boletas: BoletaServicioPrestado[];
  fechaDesde?: string;
  fechaHasta?: string;
}

const getPacienteName = (b: BoletaServicioPrestado): string =>
  b.paciente
    ? `${b.paciente.nombre} ${b.paciente.apellido}`
    : b.cita?.paciente
    ? `${b.cita.paciente.nombre} ${b.cita.paciente.apellido}`
    : b.cita?.nombre_paciente_unregistered || 'Paciente General';

const getComision = (b: BoletaServicioPrestado): number => {
  const labCost = Number(b.costo_laboratorio || 0);
  const pct = Number(b.porcentaje_comision_dr || 40);
  return b.monto_comision_dr !== undefined && b.monto_comision_dr !== null
    ? Number(b.monto_comision_dr)
    : Math.max(0, (Number(b.monto_total) - labCost) * (pct / 100));
};

export const BoletasListPDFDocument: React.FC<BoletasListPDFDocumentProps> = ({
  boletas,
  fechaDesde,
  fechaHasta,
}) => {
  const totales = boletas.reduce(
    (acc, b) => {
      acc.total += Number(b.monto_total || 0);
      acc.comision += getComision(b);
      return acc;
    },
    { total: 0, comision: 0 }
  );

  const filterText = () => {
    if (fechaDesde && fechaHasta) return `Del ${fechaDesde} al ${fechaHasta}`;
    if (fechaDesde) return `Desde el ${fechaDesde}`;
    if (fechaHasta) return `Hasta el ${fechaHasta}`;
    return 'Todas las fechas';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Reporte de Boletas Emitidas</Text>
            <Text style={styles.subtitle}>Clínica Odontológica Odonto Cool</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.subtitle}>Fecha de impresión: {new Date().toLocaleDateString('es-ES')}</Text>
            <Text style={styles.subtitle}>Filtro: {filterText()}</Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colBoleta}>Nº Boleta</Text>
            <Text style={styles.colFecha}>Fecha</Text>
            <Text style={styles.colPaciente}>Paciente</Text>
            <Text style={styles.colEstado}>Estado</Text>
            <Text style={styles.colPago}>Pago</Text>
            <Text style={styles.colTotal}>Total (Bs)</Text>
            <Text style={styles.colComision}>Comisión (Bs)</Text>
          </View>

          {/* Body */}
          {boletas.map((b) => (
            <View key={b.id} style={styles.tableRow}>
              <Text style={styles.colBoleta}>{b.numero_boleta}</Text>
              <Text style={styles.colFecha}>{String(b.fecha_emision).split('T')[0]}</Text>
              <Text style={styles.colPaciente}>{getPacienteName(b)}</Text>
              <Text style={styles.colEstado}>{b.estado?.toUpperCase() || 'PENDIENTE'}</Text>
              <Text style={styles.colPago}>{b.tipo_pago || b.tipo_paga || 'Contado'}</Text>
              <Text style={styles.colTotal}>{Number(b.monto_total || 0).toFixed(2)}</Text>
              <Text style={styles.colComision}>{getComision(b).toFixed(2)}</Text>
            </View>
          ))}

          {/* Footer */}
          {boletas.length > 0 && (
            <View style={styles.tableFooter}>
              <Text style={{ width: '70%', textAlign: 'right', paddingRight: 10 }}>Totales ({boletas.length} boletas):</Text>
              <Text style={styles.colTotal}>{totales.total.toFixed(2)}</Text>
              <Text style={styles.colComision}>{totales.comision.toFixed(2)}</Text>
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
};
