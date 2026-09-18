// src/app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";

type Mensaje = {
  role: "user" | "model";
  text: string;
};

type Presupuesto = {
  areaConstruidaM2: number;
  presupuestoMinimo: number;
  presupuestoMaximo: number;
};

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
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

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

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 p-4">
      <div className="flex w-full max-w-2xl flex-1 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-800">SmartSpecs Construct</h1>
          <p className="text-sm text-slate-500">Asistente de conceptualizacion de vivienda</p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4" style={{ maxHeight: "60vh" }}>
          {mensajes.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {cargando && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-400">
                Escribiendo...
              </div>
            </div>
          )}
          <div ref={finRef} />
        </div>

        {requerimientoId && (
          <div className="border-t border-slate-200 bg-green-50 px-6 py-4 text-sm text-green-800">
            <p className="font-medium">Requerimiento guardado</p>
            {presupuesto ? (
              <div className="mt-2 space-y-1">
                <p>{`Area construida estimada: ${presupuesto.areaConstruidaM2} m2`}</p>
                <p className="text-base font-semibold">
                  {`Presupuesto referencial: S/ ${presupuesto.presupuestoMinimo.toLocaleString()} - S/ ${presupuesto.presupuestoMaximo.toLocaleString()}`}
                </p>
                <p className="text-xs text-green-700">
                  Estimacion preliminar, sujeta a revision profesional.
                </p>
                
                <a
                  href={`/api/documento?id=${requerimientoId}`}
                  className="mt-3 inline-block rounded-lg bg-green-700 px-4 py-2 text-xs font-medium text-white hover:bg-green-800"
                >
                  Descargar documento PDF
                </a>
              </div>
            ) : (
              <p className="mt-1 text-green-600">Calculando presupuesto...</p>
            )}
          </div>
        )}

        <div className="flex gap-2 border-t border-slate-200 p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={manejarEnter}
            disabled={cargando || !!requerimientoId}
            placeholder="Escribe tu mensaje..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
          />
          <button
            onClick={enviarMensaje}
            disabled={cargando || !!requerimientoId}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}