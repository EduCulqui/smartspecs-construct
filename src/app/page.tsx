// src/app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Mensaje = {
  role: "user" | "model";
  text: string;
};

type Presupuesto = {
  areaConstruidaM2: number;
  presupuestoMinimo: number;
  presupuestoMaximo: number;
  anchoTerreno: number;
  largoTerreno: number;
  numeroPisos: number;
  preferencias: string;
};

function LogoBadge() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C2E3F]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V3h6v6h12v12H3z" stroke="#D9A441" strokeWidth="1.8" />
        <path d="M3 9h6" stroke="#D9A441" strokeWidth="1.8" />
      </svg>
    </div>
  );
}

export default function Home() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      role: "model",
      text: "Hola. Soy el asistente de SmartSpecs Construct. Cuentame sobre el terreno donde quieres construir tu vivienda (ancho, largo, numero de pisos) y que ambientes necesitas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [requerimientoId, setRequerimientoId] = useState<string | null>(null);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [imagenRender, setImagenRender] = useState<string | null>(null);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    fetch("/api/auth/yo")
      .then((r) => r.json())
      .then((d) => setEmailUsuario(d.sesion?.email ?? null));
  }, []);

  async function enviarMensaje() {
    if (!input.trim() || cargando) return;

    const nuevoHistorial: Mensaje[] = [...mensajes, { role: "user", text: input }];
    setMensajes(nuevoHistorial);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historial: nuevoHistorial }),
      });

      const data = await res.json();

      if (data.error) {
        setMensajes((prev) => [...prev, { role: "model", text: `Error: ${data.error}` }]);
        return;
      }

      setMensajes((prev) => [...prev, { role: "model", text: data.mensaje }]);

      if (data.completo) {
        setRequerimientoId(data.requerimientoId);

        const resPresupuesto = await fetch("/api/presupuesto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requerimientoId: data.requerimientoId }),
        });
        const dataPresupuesto = await resPresupuesto.json();
        setPresupuesto(dataPresupuesto);

        setGenerandoImagen(true);
        fetch("/api/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requerimientoId: data.requerimientoId }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.imagenBase64) {
              setImagenRender(`data:${d.mimeType};base64,${d.imagenBase64}`);
            }
          })
          .finally(() => setGenerandoImagen(false));
      }
    } catch {
      setMensajes((prev) => [
        ...prev,
        { role: "model", text: "No pude conectarme al servidor. Intenta de nuevo." },
      ]);
    } finally {
      setCargando(false);
    }
  }

  function manejarEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") enviarMensaje();
  }

  async function cerrarSesion() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Franja superior de acento */}
      <div className="h-1 bg-gradient-to-r from-[#B0592E] via-[#D9A441] to-[#1C2E3F]" />

      {/* Barra superior */}
      <header className="border-b border-[#8A8578]/20 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <LogoBadge />
            <div>
              <p className="text-sm font-semibold text-[#1C2E3F]">SmartSpecs Construct</p>
              <p className="text-xs text-[#8A8578]">Conceptualizacion de vivienda</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/historial"
              className="rounded-full border border-[#1C2E3F]/15 bg-[#1C2E3F]/5 px-3.5 py-1.5 text-xs font-medium text-[#1C2E3F] transition hover:bg-[#1C2E3F]/10"
            >
              Mi historial
            </a>
            {emailUsuario && (
              <span className="hidden text-xs text-[#8A8578] sm:inline">{emailUsuario}</span>
            )}
            <button
              onClick={cerrarSesion}
              className="rounded-full border border-[#8A8578]/40 px-3.5 py-1.5 text-xs font-semibold text-[#1C2E3F] transition hover:border-[#B0592E] hover:text-[#B0592E]"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-3xl px-5 py-6">
        <div className="overflow-hidden rounded-xl border border-[#8A8578]/25 bg-white shadow-sm">
          {/* Mensajes */}
          <div className="space-y-3 overflow-y-auto px-5 py-5" style={{ maxHeight: "55vh" }}>
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "model" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1C2E3F]/10">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M3 21V3h6v6h12v12H3z" stroke="#1C2E3F" strokeWidth="2" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-gradient-to-br from-[#1C2E3F] to-[#233B4F] text-white shadow-sm"
                      : "rounded-bl-sm border-l-2 border-[#D9A441] bg-[#F6F4EF] text-[#1C2E3F]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1C2E3F]/10">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21V3h6v6h12v12H3z" stroke="#1C2E3F" strokeWidth="2" />
                  </svg>
                </div>
                <div className="rounded-2xl rounded-bl-sm border-l-2 border-[#D9A441] bg-[#F6F4EF] px-4 py-2.5 text-sm text-[#8A8578]">
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={finRef} />
          </div>

          {/* Panel de resultados */}
          {requerimientoId && (
            <div className="border-t-2 border-[#D9A441] bg-gradient-to-b from-[#FBF7EE] to-[#F6F4EF] px-5 py-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3F7D58]/10 px-2.5 py-1 text-xs font-semibold text-[#3F7D58]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3F7D58]" />
                  Requerimiento guardado
                </span>
              </div>

              {presupuesto ? (
                <div className="mt-4 space-y-5">
                  <div className="rounded-lg border border-[#8A8578]/20 bg-white p-4">
                    <p className="text-sm text-[#1C2E3F]">
                      {`Area construida estimada: ${presupuesto.areaConstruidaM2} m2`}
                    </p>
                    <p className="mt-1 text-xl font-bold text-[#B0592E]">
                      {`S/ ${presupuesto.presupuestoMinimo.toLocaleString()} - S/ ${presupuesto.presupuestoMaximo.toLocaleString()}`}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8A8578]">
                      Estimacion preliminar, sujeta a revision profesional.
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#1C2E3F]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D9A441]" />
                      Vista conceptual generada por IA
                    </p>
                    {generandoImagen && (
                      <div className="flex h-48 items-center justify-center rounded-lg border border-[#8A8578]/20 bg-white text-sm text-[#8A8578]">
                        Generando vista conceptual...
                      </div>
                    )}
                    {imagenRender && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagenRender}
                        alt="Vista conceptual de la vivienda"
                        className="w-full rounded-lg border border-[#8A8578]/20 shadow-sm"
                      />
                    )}
                  </div>

                  <a
                    href={`/api/documento?id=${requerimientoId}`}
                    className="inline-flex items-center gap-2 rounded-md bg-[#B0592E] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#B0592E]/30 transition hover:bg-[#95492A] hover:shadow-md hover:shadow-[#B0592E]/40"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Descargar documento PDF
                  </a>
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#8A8578]">Calculando presupuesto...</p>
              )}
            </div>
          )}

          {/* Entrada de texto */}
          <div className="flex gap-2 border-t border-[#8A8578]/20 bg-white p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={manejarEnter}
              disabled={cargando || !!requerimientoId}
              placeholder="Escribe tu mensaje..."
              className="flex-1 rounded-full border border-[#8A8578]/40 px-4 py-2.5 text-sm text-[#1C2E3F] outline-none transition focus:border-[#B0592E] focus:ring-2 focus:ring-[#B0592E]/15 disabled:bg-[#F6F4EF]"
            />
            <button
              onClick={enviarMensaje}
              disabled={cargando || !!requerimientoId}
              className="rounded-full bg-[#1C2E3F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#152431] hover:shadow-md disabled:opacity-40 disabled:shadow-none"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}