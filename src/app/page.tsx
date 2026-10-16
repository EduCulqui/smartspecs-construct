// src/app/page.tsx
"use client";

import Link from "next/link";

const NAVY = "#1E2A47";
const VIOLET = "#6D4AFF";
const AMBER = "#D98C4A";
const BG = "#F5F4FA";
const GRIS = "#6B7280";

function LogoBadge() {
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-lg"
      style={{ backgroundColor: NAVY }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V3h6v6h12v12H3z" stroke={AMBER} strokeWidth="1.8" />
        <path d="M3 9h6" stroke={AMBER} strokeWidth="1.8" />
      </svg>
    </div>
  );
}

function IlustracionCasa() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E3E1F0] bg-white shadow-lg">
      <div
        className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-white"
        style={{ backgroundColor: NAVY }}
      >
        <span>Ejemplo ilustrativo</span>
        <span style={{ color: AMBER }}>Lote 160 m2 | 2 niveles</span>
      </div>

      <div className="flex items-center justify-center p-8" style={{ backgroundColor: BG }}>
        <svg viewBox="0 0 260 210" className="w-full max-w-xs" style={{ color: NAVY }}>
          <polyline points="40,120 130,55 220,120" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="55" y="120" width="150" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="95" y="150" width="26" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="150" y="135" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" />

          <line x1="40" y1="200" x2="220" y2="200" stroke={AMBER} strokeWidth="1.2" strokeDasharray="4 3" />
          <text x="130" y="209" textAnchor="middle" fontSize="9" fill={AMBER}>
            10.00 m
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-between border-t border-[#E3E1F0] px-4 py-3">
        <div>
          <p className="text-[11px]" style={{ color: GRIS }}>
            Estimacion preliminar directa
          </p>
          <p className="text-sm font-bold" style={{ color: NAVY }}>
            S/ 185,000 - S/ 212,000
          </p>
        </div>
        <span
          className="rounded-full px-2 py-1 text-[10px] font-semibold"
          style={{ backgroundColor: `${AMBER}15`, color: AMBER }}
        >
          Margen +/- 15%
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${VIOLET}, ${AMBER})` }} />

      <header className="border-b border-[#E3E1F0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2">
            <LogoBadge />
            <span className="text-base font-bold" style={{ color: NAVY }}>
              SmartSpecs Construct
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm transition"
            style={{ backgroundColor: NAVY }}
          >
            Ingresar
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-14 lg:grid-cols-2">
        <div>
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${VIOLET}12`, color: VIOLET }}
          >
            Metodologia parametrica residencial
          </span>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight" style={{ color: NAVY }}>
            Disena y presupuesta tu futura casa con{" "}
            <span style={{ color: VIOLET, textDecoration: "underline", textUnderlineOffset: 4 }}>
              Inteligencia Artificial
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed" style={{ color: GRIS }}>
            En SmartSpecs Construct te guiamos paso a paso para levantar los requerimientos
            de tu vivienda unifamiliar (hasta 3 pisos en zona urbana), obtener una
            estimacion presupuestal y explorar tu vista conceptual antes de construir.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:shadow-md"
              style={{ backgroundColor: NAVY }}
            >
              Iniciar levantamiento de requerimientos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="text-sm" style={{ color: GRIS }}>
              Toma solo 8-10 minutos
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              "Sin tecnicismos complejos",
              "Enfoque en viviendas hasta 3 pisos",
              "Estimacion presupuestal inmediata",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm" style={{ color: NAVY }}>
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] text-white"
                  style={{ backgroundColor: VIOLET }}
                >
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <IlustracionCasa />
      </main>
    </div>
  );
}
