// src/app/historial/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function HistorialPage() {
  const [items, setItems] = useState<Requerimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/historial")
      .then((r) => r.json())
      .then((d) => setItems(d.requerimientos ?? []))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F4EF] p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#1C2E3F]">Mi historial</h1>
          <Link
            href="/"
            className="rounded-lg border border-[#8A8578]/40 px-3 py-1.5 text-xs font-medium text-[#1C2E3F] hover:bg-white"
          >
            Volver al chat
          </Link>
        </div>

        {cargando && <p className="text-sm text-[#8A8578]">Cargando...</p>}

        {!cargando && items.length === 0 && (
          <p className="text-sm text-[#8A8578]">Aun no tienes propuestas generadas.</p>
        )}

        <div className="space-y-3">
          {items.map((item) => {
            const ambientes: string[] = JSON.parse(item.ambientes);
            const fecha = new Date(item.creadoEn).toLocaleDateString("es-PE");
            return (
              <div key={item.id} className="rounded-xl border border-[#8A8578]/30 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#1C2E3F]">
                    {`Terreno ${item.anchoTerreno}m x ${item.largoTerreno}m, ${item.numeroPisos} pisos`}
                  </p>
                  <span className="text-xs text-[#8A8578]">{fecha}</span>
                </div>
                <p className="mt-1 text-xs text-[#8A8578]">{ambientes.join(", ")}</p>
                {item.presupuestoMinimo && (
                  <p className="mt-2 text-sm font-semibold text-[#B0592E]">
                    {`S/ ${item.presupuestoMinimo.toLocaleString()} - S/ ${item.presupuestoMaximo?.toLocaleString()}`}
                  </p>
                )}
                
                <a
                  href={`/api/documento?id=${item.id}`}
                  className="mt-2 inline-block text-xs font-medium text-[#1C2E3F] hover:underline"
                >
                  Descargar PDF
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}