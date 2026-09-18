// src/app/api/auth/yo/route.ts
import { NextResponse } from "next/server";
import { obtenerSesion } from "@/lib/sesion";

export async function GET() {
  const sesion = await obtenerSesion();
  return NextResponse.json({ sesion });
}