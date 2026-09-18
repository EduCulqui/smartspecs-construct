// src/app/api/documento/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { PdfDocumento } from "@/lib/PdfDocumento";

export async function GET(req: NextRequest) {
  try {
    const requerimientoId = req.nextUrl.searchParams.get("id");

    if (!requerimientoId) {
      return NextResponse.json({ error: "Falta el parámetro id" }, { status: 400 });
    }

    const requerimiento = await prisma.requerimiento.findUnique({
      where: { id: requerimientoId },
    });

    if (!requerimiento) {
      return NextResponse.json({ error: "Requerimiento no encontrado" }, { status: 404 });
    }

    const buffer = await renderToBuffer(PdfDocumento({ requerimiento }));

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SmartSpecs_${requerimientoId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error en /api/documento:", error);
    return NextResponse.json({ error: "Error generando el documento" }, { status: 500 });
  }
}