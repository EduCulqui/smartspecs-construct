// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRETO = new TextEncoder().encode(process.env.JWT_SECRET);

const RUTAS_PUBLICAS = ["/", "/login", "/registro"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    RUTAS_PUBLICAS.includes(pathname) ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("smartspecs_sesion")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    await jwtVerify(token, SECRETO);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
