// src/lib/schema.ts
import { z } from "zod";
import { REGLAS_PILOTO, LIMITES_CHAT } from "./reglas";

export const RequerimientoSchema = z.object({
  anchoTerreno: z
    .number()
    .min(REGLAS_PILOTO.minAnchoTerreno, `El ancho minimo permitido es ${REGLAS_PILOTO.minAnchoTerreno} m`)
    .max(REGLAS_PILOTO.maxAnchoTerreno, `El ancho maximo permitido es ${REGLAS_PILOTO.maxAnchoTerreno} m`),
  largoTerreno: z
    .number()
    .min(REGLAS_PILOTO.minLargoTerreno, `El largo minimo permitido es ${REGLAS_PILOTO.minLargoTerreno} m`)
    .max(REGLAS_PILOTO.maxLargoTerreno, `El largo maximo permitido es ${REGLAS_PILOTO.maxLargoTerreno} m`),
  numeroPisos: z
    .number()
    .int("El numero de pisos debe ser un numero entero")
    .min(1, "Debe tener al menos 1 piso")
    .max(REGLAS_PILOTO.maxPisos, `El maximo permitido es ${REGLAS_PILOTO.maxPisos} pisos`),
  ambientes: z
    .array(z.string().min(1).max(60))
    .min(1, "Debes indicar al menos un ambiente")
    .max(25, "Demasiados ambientes en una sola solicitud"),
  preferencias: z.string().max(500, "La descripcion de preferencias es demasiado larga").optional(),
});

export const MensajeChatSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z
    .string()
    .min(1, "El mensaje no puede estar vacio")
    .max(
      LIMITES_CHAT.maxCaracteresPorMensaje,
      `El mensaje supera el limite de ${LIMITES_CHAT.maxCaracteresPorMensaje} caracteres`
    ),
});

export const HistorialChatSchema = z
  .array(MensajeChatSchema)
  .min(1, "El historial no puede estar vacio")
  .max(LIMITES_CHAT.maxMensajesHistorial, "La conversacion es demasiado larga, por favor inicia una nueva");

// Datos que la IA va acumulando turno a turno, antes de estar completos.
// Los numeros pueden ser null mientras el usuario no los haya dado todavia.
export const DatosParcialesSchema = z.object({
  anchoTerreno: z.number().nullable(),
  largoTerreno: z.number().nullable(),
  numeroPisos: z.number().int().nullable(),
  ambientes: z.array(z.string()),
  preferencias: z.string().optional().default(""),
});

export const RespuestaChatSchema = z.object({
  mensaje: z.string(),
  completo: z.boolean(),
  datos: DatosParcialesSchema,
});

export type DatosParciales = z.infer<typeof DatosParcialesSchema>;
