// src/app/api/render/route.ts
import { NextRequest, NextResponse } from "next/server";
import { obtenerSesion } from "@/lib/sesion";
import { prisma } from "@/lib/prisma";
import { mensajeErrorImagen } from "@/lib/erroresIA";

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

  const { requerimientoId } = body as { requerimientoId?: string };
  if (!requerimientoId) {
    return NextResponse.json({ error: "Falta el identificador del requerimiento." }, { status: 400 });
  }

  const requerimiento = await prisma.requerimiento.findFirst({
    where: { id: requerimientoId, usuarioId: sesion.usuarioId },
  });
  if (!requerimiento) {
    return NextResponse.json({ error: "Requerimiento no encontrado." }, { status: 404 });
  }

  const ambientes: string[] = (() => {
    try {
      return JSON.parse(requerimiento.ambientes);
    } catch {
      return [];
    }
  })();

  const prompt = [
    "fotografia arquitectonica realista, fachada exterior de una vivienda unifamiliar moderna",
    `${requerimiento.numeroPisos} pisos`,
    `terreno de ${requerimiento.anchoTerreno}m de ancho por ${requerimiento.largoTerreno}m de largo`,
    ambientes.length ? `incluye ${ambientes.join(", ")}` : "",
    requerimiento.preferencias || "",
    "zona urbana, Cajamarca Peru, luz de dia, alta calidad, 4k",
  ]
    .filter(Boolean)
    .join(", ");

  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=768&nologo=true&model=flux`;

    const respuestaImagen = await fetch(url);
    if (!respuestaImagen.ok) {
      throw new Error(`Pollinations respondio con estado ${respuestaImagen.status}`);
    }

    const buffer = await respuestaImagen.arrayBuffer();
    const imagenBase64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({ imagenBase64, mimeType: "image/jpeg" });
  } catch (error) {
    console.error("Error al generar la vista conceptual:", error);
    return NextResponse.json({ error: mensajeErrorImagen(error) }, { status: 502 });
  }
}
