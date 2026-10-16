// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { obtenerSesion } from "@/lib/sesion";
import { prisma } from "@/lib/prisma";
import { HistorialChatSchema, RequerimientoSchema, RespuestaChatSchema } from "@/lib/schema";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { mensajeErrorIA } from "@/lib/erroresIA";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DATOS_VACIOS = {
  anchoTerreno: null,
  largoTerreno: null,
  numeroPisos: null,
  ambientes: [] as string[],
  preferencias: "",
};

export async function POST(req: NextRequest) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ error: "Debes iniciar sesion." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud invalida." }, { status: 400 });
  }

  const { historial } = body as { historial?: unknown };

  const resultadoHistorial = HistorialChatSchema.safeParse(historial);
  if (!resultadoHistorial.success) {
    return NextResponse.json(
      { error: resultadoHistorial.error.issues[0]?.message ?? "Historial de conversacion invalido." },
      { status: 400 }
    );
  }
  const historialValidado = resultadoHistorial.data;

  const contents = historialValidado.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  let textoRespuesta: string;
  try {
    const respuesta = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: { systemInstruction: SYSTEM_PROMPT },
    });
    textoRespuesta = respuesta.text ?? "";
  } catch (error) {
    console.error("Error al llamar a Gemini:", error);
    return NextResponse.json({ error: mensajeErrorIA(error) }, { status: 502 });
  }

  const textoLimpio = textoRespuesta.trim();

  let parsed;
  try {
    parsed = RespuestaChatSchema.parse(JSON.parse(textoLimpio));
  } catch (error) {
    console.error("Respuesta de la IA con formato inesperado:", error, textoLimpio);
    return NextResponse.json({
      mensaje: "No entendi bien tu respuesta, puedes darme el dato de otra forma?",
      completo: false,
      datos: DATOS_VACIOS,
    });
  }

  if (!parsed.completo) {
    return NextResponse.json({
      mensaje: parsed.mensaje,
      completo: false,
      datos: parsed.datos,
    });
  }

  try {
    const requerimientoValidado = RequerimientoSchema.parse({
      anchoTerreno: parsed.datos.anchoTerreno,
      largoTerreno: parsed.datos.largoTerreno,
      numeroPisos: parsed.datos.numeroPisos,
      ambientes: parsed.datos.ambientes,
      preferencias: parsed.datos.preferencias,
    });

    const guardado = await prisma.requerimiento.create({
      data: {
        usuarioId: sesion.usuarioId,
        anchoTerreno: requerimientoValidado.anchoTerreno,
        largoTerreno: requerimientoValidado.largoTerreno,
        numeroPisos: requerimientoValidado.numeroPisos,
        ambientes: JSON.stringify(requerimientoValidado.ambientes),
        preferencias: requerimientoValidado.preferencias ?? "",
      },
    });

    return NextResponse.json({
      mensaje: parsed.mensaje,
      completo: true,
      datos: parsed.datos,
      requerimientoId: guardado.id,
    });
  } catch (error) {
    console.error("Error al validar/guardar el requerimiento completo:", error);
    return NextResponse.json(
      {
        error:
          "No pude validar los datos de tu terreno. Revisa que esten dentro de los rangos permitidos (ancho, largo y numero de pisos) e intentalo de nuevo.",
      },
      { status: 400 }
    );
  }
}
