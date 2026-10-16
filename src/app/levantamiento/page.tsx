// src/app/levantamiento/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const AZUL = "#1C4FA0";
const LADRILLO = "#C1440E";
const AMARILLO = "#F5A623";
const BG = "#EEF2FA";
const GRAFITO = "#22272E";
const GRIS = "#78716C";
const VERDE = "#2F7A4D";
const BORDE = "#DDE4F2";

type Mensaje = { role: "user" | "model"; text: string };

type DatosParciales = {
  anchoTerreno: number | null;
  largoTerreno: number | null;
  numeroPisos: number | null;
  ambientes: string[];
  preferencias: string;
};

type Presupuesto = {
  areaConstruidaM2: number;
  presupuestoMinimo: number;
  presupuestoMaximo: number;
  anchoTerreno: number;
  largoTerreno: number;
  numeroPisos: number;
};

const DATOS_VACIOS: DatosParciales = {
  anchoTerreno: null,
  largoTerreno: null,
  numeroPisos: null,
  ambientes: [],
  preferencias: "",
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

function PasosIndicador({ paso }: { paso: number }) {
  const pasos = ["Terreno", "Ambientes", "Presupuesto", "Vista conceptual"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {pasos.map((nombre, i) => {
        const numero = i + 1;
        const activo = numero === paso;
        const completado = numero < paso;
        return (
          <div key={nombre} className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
              style={{
                backgroundColor: completado || activo ? AMARILLO : "rgba(255,255,255,0.25)",
                color: completado || activo ? GRAFITO : "white",
              }}
            >
              {numero}
            </div>
            <span className="hidden text-xs font-semibold text-white sm:inline">{nombre}</span>
            {numero < pasos.length && <div className="hidden h-px w-4 bg-white/30 sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

const REGEX_COCHERA = /cochera|estacionamiento|garage|garaje/i;

export default function LevantamientoPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      role: "model",
      text:
        "Hola. Soy el asistente de SmartSpecs Construct. Cuentame sobre el terreno donde quieres construir tu vivienda (ancho, largo, numero de pisos) y que ambientes necesitas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [datosParciales, setDatosParciales] = useState<DatosParciales>(DATOS_VACIOS);
  const [requerimientoId, setRequerimientoId] = useState<string | null>(null);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [imagenRender, setImagenRender] = useState<string | null>(null);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const { anchoTerreno, largoTerreno, numeroPisos, ambientes } = datosParciales;
  const areaTerreno = anchoTerreno && largoTerreno ? Math.round(anchoTerreno * largoTerreno) : null;
  const areaTechada = areaTerreno && numeroPisos ? areaTerreno * numeroPisos : null;
  const tieneCochera = ambientes.some((a) => REGEX_COCHERA.test(a));

  const paso = !anchoTerreno || !largoTerreno || !numeroPisos
    ? 1
    : ambientes.length === 0
    ? 2
    : !presupuesto
    ? 3
    : imagenRender || generandoImagen
    ? 4
    : 3;

  async function enviarMensaje() {
    if (!input.trim() || cargando || !!requerimientoId) return;

    const nuevoHistorial: Mensaje[] = [...mensajes, { role: "user", text: input }];
    setMensajes(nuevoHistorial);
    setInput("");
    setCargando(true);
    setErrorEnvio("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historial: nuevoHistorial }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorEnvio(data.error ?? "No se pudo procesar tu mensaje.");
        return;
      }

      setMensajes((prev) => [...prev, { role: "model", text: data.mensaje }]);
      if (data.datos) setDatosParciales(data.datos);

      if (data.completo) {
        setRequerimientoId(data.requerimientoId);

        const resPresupuesto = await fetch("/api/presupuesto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requerimientoId: data.requerimientoId }),
        });
        const dataPresupuesto = await resPresupuesto.json();
        if (resPresupuesto.ok) setPresupuesto(dataPresupuesto);

        setGenerandoImagen(true);
        fetch("/api/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requerimientoId: data.requerimientoId }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.imagenBase64) setImagenRender(`data:${d.mimeType};base64,${d.imagenBase64}`);
          })
          .finally(() => setGenerandoImagen(false));
      }
    } catch {
      setErrorEnvio("No pude conectarme al servidor. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function manejarEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") enviarMensaje();
  }

  async function cerrarSesion() {
    if (cerrandoSesion) return;
    setCerrandoSesion(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  }

  const cos = areaTerreno ? 72.3 : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      <header style={{ backgroundColor: AZUL }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <LogoBadge />
            <span className="text-sm font-bold text-white">SmartSpecs Construct</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PasosIndicador paso={paso} />

            <div className="flex items-center gap-2">
              <Link
                href="/historial"
                className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold"
                style={{ color: AZUL }}
              >
                Mi historial
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
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-5 py-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: BORDE }}>
          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5" style={{ maxHeight: "55vh" }}>
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2 text-sm"
                  style={
                    m.role === "user"
                      ? { backgroundColor: AZUL, color: "white" }
                      : { backgroundColor: BG, color: GRAFITO }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2 text-sm" style={{ backgroundColor: BG, color: GRIS }}>
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={finRef} />
          </div>

          {errorEnvio && (
            <div className="mx-5 mb-3 rounded-lg border-2 border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {errorEnvio}
            </div>
          )}

          {requerimientoId && (
            <div className="border-t-2 px-5 py-4 text-sm" style={{ borderColor: BORDE, backgroundColor: `${VERDE}10` }}>
              <p className="font-bold" style={{ color: VERDE }}>
                Requerimiento guardado
              </p>

              {presupuesto ? (
                <div className="mt-2 space-y-2">
                  <p className="text-base font-semibold" style={{ color: GRAFITO }}>
                    {`Presupuesto referencial: S/ ${presupuesto.presupuestoMinimo.toLocaleString()} - S/ ${presupuesto.presupuestoMaximo.toLocaleString()}`}
                  </p>
                  <p className="text-xs" style={{ color: GRIS }}>
                    Estimacion preliminar, sujeta a revision profesional. Margen de incertidumbre +/- 15%.
                  </p>

                  <div className="mt-3">
                    <p className="mb-1 text-xs font-medium" style={{ color: GRIS }}>
                      Vista conceptual (generada por IA)
                    </p>
                    {generandoImagen && (
                      <div
                        className="flex h-48 items-center justify-center rounded-lg border-2 text-sm"
                        style={{ borderColor: BORDE, backgroundColor: BG, color: GRIS }}
                      >
                        Generando vista conceptual...
                      </div>
                    )}
                    {imagenRender && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagenRender}
                        alt="Vista conceptual de la vivienda"
                        className="w-full rounded-lg border-2"
                        style={{ borderColor: BORDE }}
                      />
                    )}
                  </div>

                  <a
                    href={`/api/documento?id=${requerimientoId}`}
                    className="mt-3 inline-block rounded-lg px-4 py-2 text-xs font-bold text-white"
                    style={{ backgroundColor: VERDE }}
                  >
                    Descargar documento PDF
                  </a>
                </div>
              ) : (
                <p className="mt-1" style={{ color: VERDE }}>
                  Calculando presupuesto...
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 border-t-2 p-4" style={{ borderColor: BORDE }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={manejarEnter}
              disabled={cargando || !!requerimientoId}
              placeholder="Escribe tu mensaje..."
              maxLength={600}
              className="flex-1 rounded-lg border-2 px-3 py-2 text-sm outline-none transition disabled:bg-[#EEF2FA]"
              style={{ borderColor: BORDE, color: GRAFITO }}
            />
            <button
              onClick={enviarMensaje}
              disabled={cargando || !!requerimientoId}
              className="rounded-lg px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
              style={{ backgroundColor: LADRILLO }}
            >
              Enviar
            </button>
          </div>
        </div>

        <aside className="overflow-hidden rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: BORDE }}>
          <div className="px-5 py-4" style={{ backgroundColor: GRAFITO }}>
            <h2 className="text-sm font-bold text-white">Ficha parametrica actual</h2>
            <p className="mt-0.5 text-xs text-white/60">Se completa a medida que avanza la conversacion</p>
          </div>

          <div className="p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt style={{ color: GRIS }}>Area del terreno</dt>
                <dd className="font-bold" style={{ color: AZUL }}>
                  {areaTerreno ? `${areaTerreno} m2` : "-"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt style={{ color: GRIS }}>Huella de ocupacion (COS)</dt>
                <dd className="font-bold" style={{ color: AZUL }}>
                  {cos ? `${cos}%` : "-"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt style={{ color: GRIS }}>Area techada estimada</dt>
                <dd className="font-bold" style={{ color: AZUL }}>
                  {areaTechada ? `${areaTechada} m2` : "-"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt style={{ color: GRIS }}>Numero de pisos</dt>
                <dd className="font-bold" style={{ color: AZUL }}>
                  {numeroPisos ?? "-"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt style={{ color: GRIS }}>Estacionamientos</dt>
                <dd className="font-bold" style={{ color: AZUL }}>
                  {ambientes.length ? (tieneCochera ? 1 : 0) : "-"}
                </dd>
              </div>
            </dl>

            {ambientes.length > 0 && (
              <div className="mt-4 border-t-2 pt-4" style={{ borderColor: BORDE }}>
                <p className="text-xs font-medium" style={{ color: GRIS }}>
                  Ambientes indicados
                </p>
                <p className="mt-1 text-sm" style={{ color: GRAFITO }}>
                  {ambientes.join(", ")}
                </p>
              </div>
            )}

            <div className="mt-5 rounded-lg px-3 py-2.5 text-[11px]" style={{ backgroundColor: `${AMARILLO}30`, color: LADRILLO }}>
              Estos valores son referenciales para un piloto academico y no sustituyen un expediente tecnico profesional.
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
