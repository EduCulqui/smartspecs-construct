// src/app/page.tsx
"use client";

import Link from "next/link";

const AZUL = "#122F5E";
const AZUL_OSCURO = "#0B1F40";
const LADRILLO = "#C1440E";
const AMARILLO = "#F5A623";
const GRAFITO = "#22272E";

function LogoBadge() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V3h6v6h12v12H3z" stroke={AZUL} strokeWidth="1.8" />
        <path d="M3 9h6" stroke={AZUL} strokeWidth="1.8" />
      </svg>
    </div>
  );
}

function IlustracionCasa() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 text-xs font-bold text-white" style={{ backgroundColor: GRAFITO }}>
        <span>Ejemplo ilustrativo</span>
        <span style={{ color: AMARILLO }}>Lote 160 m2 | 2 niveles</span>
      </div>

      <div className="flex items-center justify-center p-8" style={{ backgroundColor: "#EEF2FA" }}>
        <svg viewBox="0 0 260 210" className="w-full max-w-xs" style={{ color: AZUL }}>
          <polyline points="40,120 130,55 220,120" fill="none" stroke={LADRILLO} strokeWidth="3" />
          <rect x="55" y="120" width="150" height="70" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <rect x="95" y="150" width="26" height="40" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <rect x="150" y="135" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" />

          <line x1="40" y1="200" x2="220" y2="200" stroke={AMARILLO} strokeWidth="2" strokeDasharray="4 3" />
          <text x="130" y="209" textAnchor="middle" fontSize="10" fill={LADRILLO} fontWeight="bold">
            10.00 m
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: GRAFITO }}>
        <div>
          <p className="text-[11px] text-white/60">Estimacion preliminar directa</p>
          <p className="text-sm font-bold text-white">S/ 185,000 - S/ 212,000</p>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: AMARILLO, color: GRAFITO }}>
          Margen +/- 15%
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: AZUL }}>
      <header className="border-b border-white/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <LogoBadge />
            <span className="text-base font-bold text-white">SmartSpecs Construct</span>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold shadow-sm transition hover:shadow-md"
            style={{ color: AZUL }}
          >
            Ingresar
          </Link>
        </div>
      </header>

      <main
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${AZUL} 0%, ${AZUL_OSCURO} 100%)` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: AMARILLO, color: GRAFITO }}
            >
              Metodologia parametrica residencial
            </span>

            <h1 className="mt-5 text-5xl font-extrabold leading-tight text-white">
              Disena y presupuesta tu futura casa con{" "}
              <span style={{ color: AMARILLO }}>Inteligencia Artificial</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-white/80">
              Te guiamos paso a paso para levantar los requerimientos de tu vivienda
              unifamiliar (hasta 3 pisos en zona urbana), obtener una estimacion
              presupuestal y explorar tu vista conceptual antes de construir.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-bold text-white shadow-xl transition hover:scale-[1.02]"
                style={{ backgroundColor: LADRILLO }}
              >
                Iniciar levantamiento de requerimientos
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <span className="text-sm font-medium text-white/70">Toma solo 8-10 minutos</span>
            </div>
          </div>

          <IlustracionCasa />
        </div>
      </main>

      <section style={{ backgroundColor: LADRILLO }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-10 sm:grid-cols-3">
          {[
            { num: "3 pisos", label: "maximo en el piloto" },
            { num: "8-10 min", label: "para completar el levantamiento" },
            { num: "+/- 15%", label: "margen de precision presupuestal" },
          ].map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-3xl font-extrabold text-white">{stat.num}</p>
              <p className="mt-1 text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: AMARILLO }}>
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              "Sin tecnicismos complejos",
              "Enfoque en viviendas hasta 3 pisos",
              "Estimacion presupuestal inmediata",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-white/40 p-4">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: GRAFITO }}
                >
                  ✓
                </span>
                <span className="text-sm font-semibold" style={{ color: GRAFITO }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
