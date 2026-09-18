// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { crearSesion } from "@/lib/sesion";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const emailNormalizado = (email ?? "").trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({ where: { email: emailNormalizado } });
    if (!usuario) {
      return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) {
      return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
    }

    await crearSesion(usuario.id, usuario.email);

    return NextResponse.json({ ok: true, email: usuario.email });
  } catch (error) {
    console.error("Error en /api/auth/login:", error);
    return NextResponse.json({ error: "Error al iniciar sesion" }, { status: 500 });
  }
}