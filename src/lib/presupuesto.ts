// src/lib/presupuesto.ts

// Tabla de referencia editable. Ajusta estos valores cuando tengas datos reales.
// Están en soles por metro cuadrado de construcción (no de terreno).
export const COSTO_POR_M2 = {
  acabadoEconomico: 900,
  acabadoEstandar: 1300,
  acabadoPremium: 1900,
} as const;

// Margen de incertidumbre que declaramos en el acta (±15%)
const MARGEN_INCERTIDUMBRE = 0.15;

type CalculoPresupuesto = {
  areaConstruidaM2: number;
  presupuestoMinimo: number;
  presupuestoMaximo: number;
  costoBaseUsado: number;
};

export function calcularPresupuesto(
  anchoTerreno: number,
  largoTerreno: number,
  numeroPisos: number,
  nivelAcabado: keyof typeof COSTO_POR_M2 = "acabadoEstandar"
): CalculoPresupuesto {
  // Área construida = área del terreno × número de pisos
  // (asumimos que cada piso ocupa el 100% del terreno; es una simplificación
  // razonable para un presupuesto REFERENCIAL, no definitivo)
  const areaTerreno = anchoTerreno * largoTerreno;
  const areaConstruidaM2 = areaTerreno * numeroPisos;

  const costoBase = COSTO_POR_M2[nivelAcabado];
  const costoTotal = areaConstruidaM2 * costoBase;

  const presupuestoMinimo = Math.round(costoTotal * (1 - MARGEN_INCERTIDUMBRE));
  const presupuestoMaximo = Math.round(costoTotal * (1 + MARGEN_INCERTIDUMBRE));

  return {
    areaConstruidaM2,
    presupuestoMinimo,
    presupuestoMaximo,
    costoBaseUsado: costoBase,
  };
}