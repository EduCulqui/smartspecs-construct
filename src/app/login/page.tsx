// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AZUL = "#1C4FA0";
const LADRILLO = "#C1440E";
const AMARILLO = "#F5A623";
const BG = "#F7F5F0";
const GRAFITO = "#22272E";
const GRIS = "#78716C";
const BORDE = "#E5E1D8";

function PanelPlano() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden p-10 md:flex" style={{ backgroundColor: AZUL }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#F7F5F0 1px, transparent 1px), linear-gradient(90deg, #F7F5F0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 21V3h6v6h12v12H3z" stroke={AMARILLO} strokeWidth="1.6" />
            <path d="M3 9h6" stroke={AMARILLO} strokeWidth="1.6" />
          </svg>
          <span className="text-sm font-medium tracking-wide">SmartSpecs Construct</span>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <svg viewBox="0 0 260 210" className="w-full max-w-md text-white/85">
          <polyline points="40,120 130,55 220,120" fill="none" stroke={LADRILLO} strokeWidth="2.5" />
          <rect x="55" y="120" width="150" height="70" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="95" y="150" width="26" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="150" y="135" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" />

          <line x1="40" y1="200" x2="220" y2="200" stroke={AMARILLO} strokeWidth="1.4" strokeDasharray="4 3" />
          <line x1="40" y1="196" x2="40" y2="204" stroke={AMARILLO} strokeWidth="1.4" />
          <line x1="220" y1="196" x2="220" y2="204" stroke={AMARILLO} strokeWidth="1.4" />
          <text x="130" y="209" textAnchor="middle" fontSize="10" fill={AMARILLO} fontWeight="bold">
            10.00 m
          </text>

          <line x1="232" y1="120" x2="232" y2="190" stroke={AMARILLO} strokeWidth="1.4" strokeDasharray="4 3" />
          <text x="238" y="158" fontSize="10" fill={AMARILLO} fontWeight="bold">
            7.00 m
          </text>
        </svg>
      </div>

      <div className="relative max-w-xs">
        <p className="text-sm leading-relaxed text-white/75">
          De la idea al plano preliminar: cuenta tu terreno y tus ambientes, y recibe una
          especificacion, presupuesto y vista conceptual en minutos.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar sesion");
        return;
      }

      router.push("/levantamiento");
      router.refresh();
    } catch {
      setError("No se pudo conectar al servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <PanelPlano />

      <div className="flex items-center justify-center p-6" style={{ backgroundColor: BG }}>
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold" style={{ color: GRAFITO }}>
            Inicia sesion
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: GRIS }}>
            Accede a tu cuenta para continuar con tus proyectos.
          </p>

          <form onSubmit={manejarSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: GRAFITO }}>
                Correo electronico
              </label>
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: GRIS }}
                >
                  <path
                    d="M3 6l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full rounded-md border-2 bg-white py-3 pl-10 pr-3.5 text-sm outline-none transition"
                  style={{ borderColor: BORDE, color: GRAFITO }}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: GRAFITO }}>
                Contrasena
              </label>
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: GRIS }}
                >
                  <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border-2 bg-white py-3 pl-10 pr-3.5 text-sm outline-none transition"
                  style={{ borderColor: BORDE, color: GRAFITO }}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md border-2 border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-50 disabled:shadow-none"
              style={{ backgroundColor: LADRILLO }}
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: GRIS }}>
            No tienes cuenta?{" "}
            <Link href="/registro" className="font-medium hover:underline" style={{ color: AZUL }}>
              Crea una
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
