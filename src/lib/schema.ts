// src/lib/schema.ts
import { z } from "zod";
import { REGLAS_PILOTO } from "./reglas";

// Este es el "molde" exacto que la IA debe llenar.
// Si la respuesta de la IA no calza aquí, se rechaza automáticamente.
export const RequerimientoSchema = z.object({
  anchoTerreno: z
    .number()
    .min(REGLAS_PILOTO.minAnchoTerreno, "El ancho del terreno es muy pequeño para el piloto")
    .max(REGLAS_PILOTO.maxAnchoTerreno, "El ancho del terreno excede el rango del piloto"),

  largoTerreno: z
    .number()
    .min(REGLAS_PILOTO.minLargoTerreno)
    .max(REGLAS_PILOTO.maxLargoTerreno),

  numeroPisos: z
    .number()
    .int()
    .min(1)
    .max(REGLAS_PILOTO.maxPisos, `El piloto solo admite hasta ${REGLAS_PILOTO.maxPisos} pisos`),

  ambientes: z
    .array(z.string())
    .min(1, "Debe registrarse al menos un ambiente"),

  preferencias: z.string().optional().default(""),
});

export type Requerimiento = z.infer<typeof RequerimientoSchema>;