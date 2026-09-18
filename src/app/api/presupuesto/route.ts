// src/app/api/presupuesto/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularPresupuesto } from "@/lib/presupuesto";

export async function POST(req: NextRequest) {
  try {
    const { requerimientoId } = await req.json();

    if (!requerimientoId) {
      return NextResponse.json({ error: "Falta el requerimientoId" }, { status: 400 });
    }

    const requerimiento = await prisma.requerimiento.findUnique({
      where: { id: requerimientoId },
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
    });
  } catch (error) {
    console.error("Error en /api/presupuesto:", error);
    return NextResponse.json({ error: "Error calculando el presupuesto" }, { status: 500 });
  }
}