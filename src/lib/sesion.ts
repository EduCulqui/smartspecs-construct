// src/lib/sesion.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRETO = new TextEncoder().encode(process.env.JWT_SECRET);
const NOMBRE_COOKIE = "smartspecs_sesion";

export async function crearSesion(usuarioId: string, email: string) {
  const token = await new SignJWT({ usuarioId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRETO);

  const cookieStore = await cookies();
  cookieStore.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function obtenerSesion(): Promise<{ usuarioId: string; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOMBRE_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRETO);
    return { usuarioId: payload.usuarioId as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete(NOMBRE_COOKIE);
}