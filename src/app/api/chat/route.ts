// src/app/api/chat/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { RequerimientoSchema } from "@/lib/schema";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { historial } = await req.json();
    // historial = [{ role: "user" | "model", text: string }, ...]

    const contents = historial.map((m: { role: string; text: string }) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const respuesta = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const texto = respuesta.text ?? "";

    const posibleJson = texto.trim();
    if (posibleJson.startsWith("{")) {
      const parsed = JSON.parse(posibleJson);

      if (parsed.completo === true) {
        const datosValidados = RequerimientoSchema.parse(parsed.datos);

        const guardado = await prisma.requerimiento.create({
          data: {
            anchoTerreno: datosValidados.anchoTerreno,
            largoTerreno: datosValidados.largoTerreno,
            numeroPisos: datosValidados.numeroPisos,
            ambientes: JSON.stringify(datosValidados.ambientes),
            preferencias: datosValidados.preferencias ?? "",
            estado: "VALIDADO",
          },
        });

        return NextResponse.json({
          completo: true,
          requerimientoId: guardado.id,
          mensaje: "¡Listo! Ya tengo todos tus datos. Generando tu propuesta...",
        });
      }
    }

    return NextResponse.json({
      completo: false,
      mensaje: texto.replace("[ESTADO:INCOMPLETO]", "").trim(),
    });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      { error: "Ocurrió un error procesando tu mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}