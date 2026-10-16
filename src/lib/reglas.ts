// src/lib/reglas.ts
export const REGLAS_PILOTO = {
  maxPisos: 3,
  minAnchoTerreno: 5,
  maxAnchoTerreno: 30,
  minLargoTerreno: 5,
  maxLargoTerreno: 40,
  zonaPermitida: "urbana",
  ciudadPermitida: "Cajamarca",
} as const;

export const LIMITES_CHAT = {
  maxCaracteresPorMensaje: 600,
  maxMensajesHistorial: 40,
} as const;
