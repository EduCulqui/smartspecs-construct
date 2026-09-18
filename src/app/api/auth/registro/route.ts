// src/app/api/auth/registro/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { crearSesion } from "@/lib/sesion";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Correo y contraseña (minimo 6 caracteres) son obligatorios" },
        { status: 400 }
      );
    }

    const emailNormalizado = email.trim().toLowerCase();

    const existente = await prisma.usuario.findUnique({ where: { email: emailNormalizado } });
    if (existente) {
      return NextResponse.json({ error: "Ese correo ya esta registrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: { email: emailNormalizado, passwordHash },
    });

    await crearSesion(usuario.id, usuario.email);

    return NextResponse.json({ ok: true, email: usuario.email });
  } catch (error) {
    console.error("Error en /api/auth/registro:", error);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}