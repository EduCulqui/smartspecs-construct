// src/app/api/historial/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obtenerSesion } from "@/lib/sesion";

export async function GET() {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ error: "Debes iniciar sesion" }, { status: 401 });
  }

  const requerimientos = await prisma.requerimiento.findMany({
    where: { usuarioId: sesion.usuarioId },
    orderBy: { creadoEn: "desc" },
  });

  return NextResponse.json({ requerimientos });
}