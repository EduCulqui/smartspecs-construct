// src/lib/PdfDocumento.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  titulo: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 24,
  },
  seccion: {
    marginBottom: 18,
  },
  seccionTitulo: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
    borderBottom: "1 solid #cbd5e1",
    paddingBottom: 4,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  etiqueta: {
    color: "#64748b",
  },
  valor: {
    fontWeight: 700,
  },
  presupuestoBox: {
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  presupuestoTexto: {
    fontSize: 14,
    fontWeight: 700,
    color: "#166534",
  },
  nota: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 20,
  },
});

type Props = {
  requerimiento: {
    id: string;
    anchoTerreno: number;
    largoTerreno: number;
    numeroPisos: number;
    ambientes: string; // JSON string
    preferencias: string;
    presupuestoMinimo: number | null;
    presupuestoMaximo: number | null;
    creadoEn: Date;
  };
};

export function PdfDocumento({ requerimiento }: Props) {
  const ambientes: string[] = JSON.parse(requerimiento.ambientes);
  const areaTerreno = requerimiento.anchoTerreno * requerimiento.largoTerreno;
  const areaConstruida = areaTerreno * requerimiento.numeroPisos;
  const fecha = new Date(requerimiento.creadoEn).toLocaleDateString("es-PE");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.titulo}>SmartSpecs Construct</Text>
        <Text style={styles.subtitulo}>
          Propuesta preliminar de requerimientos — Generado el {fecha}
        </Text>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>1. Datos del terreno</Text>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Ancho</Text>
            <Text style={styles.valor}>{requerimiento.anchoTerreno} m</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Largo</Text>
            <Text style={styles.valor}>{requerimiento.largoTerreno} m</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Área del terreno</Text>
            <Text style={styles.valor}>{areaTerreno} m²</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Número de pisos</Text>
            <Text style={styles.valor}>{requerimiento.numeroPisos}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.etiqueta}>Área construida estimada</Text>
            <Text style={styles.valor}>{areaConstruida} m²</Text>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>2. Ambientes solicitados</Text>
          {ambientes.map((amb, i) => (
            <Text key={i}>• {amb}</Text>
          ))}
        </View>

        {requerimiento.preferencias && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>3. Preferencias adicionales</Text>
            <Text>{requerimiento.preferencias}</Text>
          </View>
        )}

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>4. Estimación presupuestal referencial</Text>
          <View style={styles.presupuestoBox}>
            <Text style={styles.presupuestoTexto}>
              S/ {requerimiento.presupuestoMinimo?.toLocaleString()} — S/{" "}
              {requerimiento.presupuestoMaximo?.toLocaleString()}
            </Text>
          </View>
        </View>

        <Text style={styles.nota}>
          Documento generado automáticamente por SmartSpecs Construct como prototipo académico.
          Esta es una estimación preliminar sujeta a revisión profesional. No constituye una
          cotización definitiva ni sustituye la evaluación de un arquitecto o ingeniero
          colegiado. ID de requerimiento: {requerimiento.id}
        </Text>
      </Page>
    </Document>
  );
}