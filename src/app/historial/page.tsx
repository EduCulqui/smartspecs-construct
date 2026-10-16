// src/app/historial/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const AZUL = "#1C4FA0";
const LADRILLO = "#C1440E";
const AMARILLO = "#F5A623";
const BG = "#EEF2FA";
const GRAFITO = "#22272E";
const GRIS = "#78716C";
const BORDE = "#DDE4F2";

type Requerimiento = {
  id: string;
  creadoEn: string;
  anchoTerreno: number;
  largoTerreno: number;
  numeroPisos: number;
  ambientes: string;
  presupuestoMinimo: number | null;
  presupuestoMaximo: number | null;
};

function LogoBadge() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V3h6v6h12v12H3z" stroke={AZUL} strokeWidth="1.8" />
        <path d="M3 9h6" stroke={AZUL} strokeWidth="1.8" />
      </svg>
    </div>
  );
}

function IconoCasaMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 21V3h6v6h12v12H3z" stroke={AZUL} strokeWidth="1.8" />
      <path d="M3 9h6" stroke={AZUL} strokeWidth="1.8" />
    </svg>
  );
}

function TarjetaRequerimiento({ item }: { item: Requerimiento }) {
  const ambientes: string[] = (() => {
    try {
      return JSON.parse(item.ambientes);
    } catch {
      return [];
    }
  })();
  const fecha = new Date(item.creadoEn).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const mostrados = ambientes.slice(0, 4);
  const restantes = ambientes.length - mostrados.length;

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition hover:shadow-lg" style={{ borderColor: BORDE }}>
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${AZUL}, ${LADRILLO})` }} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${AZUL}14` }}>
              <IconoCasaMini />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: GRAFITO }}>
                {`Terreno ${item.anchoTerreno} x ${item.largoTerreno} m`}
              </p>
              <p className="text-xs" style={{ color: GRIS }}>
                {`${item.numeroPisos} ${item.numeroPisos === 1 ? "piso" : "pisos"} · ${fecha}`}
              </p>
            </div>
          </div>
        </div>

        {mostrados.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mostrados.map((a) => (
              <span key={a} className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ backgroundColor: BG, color: GRAFITO }}>
                {a}
              </span>
            ))}
            {restantes > 0 && (
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ color: GRIS }}>
                {`+${restantes} mas`}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-end justify-between border-t-2 pt-3" style={{ borderColor: BORDE }}>
          <div>
            <p className="text-[11px]" style={{ color: GRIS }}>
              Presupuesto referencial
            </p>
            {item.presupuestoMinimo && item.presupuestoMaximo ? (
              <p className="text-sm font-bold" style={{ color: GRAFITO }}>
                {`S/ ${item.presupuestoMinimo.toLocaleString()} - S/ ${item.presupuestoMaximo.toLocaleString()}`}
              </p>
            ) : (
              <p className="text-sm" style={{ color: GRIS }}>
                Sin calcular
              </p>
            )}
          </div>

          <a
            href={`/api/documento?id=${item.id}`}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:shadow-md"
            style={{ backgroundColor: LADRILLO }}
          >
            PDF
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function EstadoVacio() {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-16 text-center" style={{ borderColor: BORDE, backgroundColor: "white" }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${AZUL}14` }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M3 21V3h6v6h12v12H3z" stroke={AZUL} strokeWidth="1.6" />
          <path d="M3 9h6" stroke={AZUL} strokeWidth="1.6" />
        </svg>
      </div>
      <h2 className="mt-4 text-base font-semibold" style={{ color: GRAFITO }}>
        Aun no tienes levantamientos
      </h2>
      <p className="mt-1 max-w-sm text-sm" style={{ color: GRIS }}>
        Cuando completes una conversacion con el asistente, tu especificacion, presupuesto y vista
        conceptual apareceran aqui.
      </p>
      <Link
        href="/levantamiento"
        className="mt-5 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md"
        style={{ backgroundColor: LADRILLO }}
      >
        Iniciar mi primer levantamiento
      </Link>
    </div>
  );
}

function Esqueleto() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl border-2 bg-white" style={{ borderColor: BORDE }} />
      ))}
    </div>
  );
}

export default function HistorialPage() {
  const [items, setItems] = useState<Requerimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  useEffect(() => {
    fetch("/api/historial")
      .then((r) => r.json())
      .then((d) => setItems(d.requerimientos ?? []))
      .finally(() => setCargando(false));
  }, []);

  async function cerrarSesion() {
    if (cerrandoSesion) return;
    setCerrandoSesion(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <header style={{ backgroundColor: AZUL }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <LogoBadge />
            <span className="text-sm font-bold text-white">SmartSpecs Construct</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/levantamiento" className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold" style={{ color: AZUL }}>
              Volver al chat
            </Link>
            <button
              onClick={cerrarSesion}
              disabled={cerrandoSesion}
              className="rounded-full border-2 border-white/50 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
            >
              {cerrandoSesion ? "Saliendo..." : "Cerrar sesion"}
            </button>
          </div>
        </div>
      </header>

      <div className="h-2" style={{ background: `linear-gradient(90deg, ${LADRILLO}, ${AMARILLO})` }} />

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: GRAFITO }}>
            Mis levantamientos
          </h1>
          <p className="mt-1 text-sm" style={{ color: GRIS }}>
            {items.length > 0
              ? `${items.length} ${items.length === 1 ? "propuesta generada" : "propuestas generadas"}`
              : "Aqui veras el historial de tus conversaciones con el asistente"}
          </p>
        </div>

        {cargando && <Esqueleto />}
        {!cargando && items.length === 0 && <EstadoVacio />}
        {!cargando && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <TarjetaRequerimiento key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
