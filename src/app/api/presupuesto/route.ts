// src/app/api/presupuesto/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularPresupuesto } from "@/lib/presupuesto";
import { obtenerSesion } from "@/lib/sesion";

export async function POST(req: NextRequest) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ error: "Debes iniciar sesion." }, { status: 401 });
  }

  try {
    const { requerimientoId } = await req.json();

    if (!requerimientoId) {
      return NextResponse.json({ error: "Falta el requerimientoId" }, { status: 400 });
    }

    const requerimiento = await prisma.requerimiento.findFirst({
      where: { id: requerimientoId, usuarioId: sesion.usuarioId },
    });

    if (!requerimiento) {
      return NextResponse.json({ error: "Requerimiento no encontrado" }, { status: 404 });
    }

    const resultado = calcularPresupuesto(
      requerimiento.anchoTerreno,
      requerimiento.largoTerreno,
      requerimiento.numeroPisos
    );

    const actualizado = await prisma.requerimiento.update({
      where: { id: requerimientoId },
      data: {
        presupuestoMinimo: resultado.presupuestoMinimo,
        presupuestoMaximo: resultado.presupuestoMaximo,
      },
    });

    return NextResponse.json({
      areaConstruidaM2: resultado.areaConstruidaM2,
      presupuestoMinimo: actualizado.presupuestoMinimo,
      presupuestoMaximo: actualizado.presupuestoMaximo,
      anchoTerreno: requerimiento.anchoTerreno,
      largoTerreno: requerimiento.largoTerreno,
      numeroPisos: requerimiento.numeroPisos,
    });
  } catch (error) {
    console.error("Error en /api/presupuesto:", error);
    return NextResponse.json({ error: "Error calculando el presupuesto" }, { status: 500 });
  }
}
