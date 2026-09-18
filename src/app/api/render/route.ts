// src/app/api/render/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { requerimientoId } = await req.json();

    const requerimiento = await prisma.requerimiento.findUnique({
      where: { id: requerimientoId },
    });

    if (!requerimiento) {
      return NextResponse.json({ error: "Requerimiento no encontrado" }, { status: 404 });
    }

    const ambientes: string[] = JSON.parse(requerimiento.ambientes);

    const prompt = `Professional architectural rendering, photorealistic exterior of a modern single-family house in Cajamarca, Peru. ${requerimiento.numeroPisos} floors, ${requerimiento.anchoTerreno}x${requerimiento.largoTerreno} meter lot. Rooms: ${ambientes.join(", ")}. Style: ${requerimiento.preferencias || "contemporary, clean lines, natural lighting"}. Daylight, clear sky, residential street, high quality real estate photography, 4k`;

    const urlImagen = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=768&nologo=true&model=flux`;

    // Descargamos la imagen desde Pollinations y la devolvemos como base64
    const respuestaImagen = await fetch(urlImagen);

    if (!respuestaImagen.ok) {
      return NextResponse.json({ error: "No se pudo generar la imagen" }, { status: 500 });
    }

    const arrayBuffer = await respuestaImagen.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      imagenBase64: base64,
      mimeType: "image/jpeg",
    });
  } catch (error) {
    console.error("Error en /api/render:", error);
    return NextResponse.json({ error: "Error generando la imagen conceptual" }, { status: 500 });
  }
}