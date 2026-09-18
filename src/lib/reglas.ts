// src/lib/reglas.ts

// Todos los límites del piloto viven AQUÍ y solo aquí.
// Si algún día cambian las reglas (ej. permitir 4 pisos), se cambia en un solo lugar.
export const REGLAS_PILOTO = {
  maxPisos: 3,
  minAnchoTerreno: 5,   // metros
  maxAnchoTerreno: 30,
  minLargoTerreno: 5,
  maxLargoTerreno: 40,
  zonaPermitida: "urbana",
  ciudadPermitida: "Cajamarca",
} as const;