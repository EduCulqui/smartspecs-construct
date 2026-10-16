// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { obtenerSesion } from "@/lib/sesion";
import { prisma } from "@/lib/prisma";
import { HistorialChatSchema, RequerimientoSchema } from "@/lib/schema";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { mensajeErrorIA } from "@/lib/erroresIA";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

  if (textoLimpio.startsWith("{")) {
    try {
      const datos = JSON.parse(textoLimpio);

      if (datos.completo && datos.datos) {
        const requerimientoValidado = RequerimientoSchema.parse(datos.datos);

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
          mensaje: "Datos recibidos. Calculando tu presupuesto referencial...",
          completo: true,
          requerimientoId: guardado.id,
        });
      }
    } catch (error) {
      console.error("Error al procesar la respuesta estructurada:", error);
      return NextResponse.json(
        {
          error:
            "No pude validar los datos de tu terreno. Revisa que esten dentro de los rangos permitidos (ancho, largo y numero de pisos) e intentalo de nuevo.",
        },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({
    mensaje: textoLimpio.replace("[ESTADO:INCOMPLETO]", "").trim(),
    completo: false,
  });
}
