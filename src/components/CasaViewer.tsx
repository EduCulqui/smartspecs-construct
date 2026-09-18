// src/components/CasaViewer.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type Props = {
  anchoTerreno: number;
  largoTerreno: number;
  numeroPisos: number;
  preferencias?: string;
};

const ALTURA_POR_PISO = 3;
const COLORES_PISO = ["#f5f0e6", "#e8dfc8", "#d9cba3"];

function Piso({ ancho, largo, y, color }: { ancho: number; largo: number; y: number; color: string }) {
  return (
    <mesh position={[0, y, 0]} castShadow receiveShadow>
      <boxGeometry args={[ancho, ALTURA_POR_PISO, largo]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

function Techo({ ancho, largo, y }: { ancho: number; largo: number; y: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
      <coneGeometry args={[Math.max(ancho, largo) * 0.75, 1.5, 4]} />
      <meshStandardMaterial color="#7a3b1e" roughness={0.7} />
    </mesh>
  );
}

function Puerta({ x, largo }: { x: number; largo: number }) {
  return (
    <mesh position={[x, 1.1, -largo / 2 - 0.01]}>
      <boxGeometry args={[0.9, 2.2, 0.05]} />
      <meshStandardMaterial color="#4b2e1e" roughness={0.6} />
    </mesh>
  );
}

function Ventana({ x, y, largo }: { x: number; y: number; largo: number }) {
  return (
    <mesh position={[x, y, -largo / 2 - 0.01]}>
      <boxGeometry args={[1.1, 1.1, 0.05]} />
      <meshStandardMaterial color="#bfe3f0" roughness={0.1} metalness={0.3} />
    </mesh>
  );
}

function CasaVecina({
  x,
  ancho,
  largo,
  altura,
  color,
}: {
  x: number;
  ancho: number;
  largo: number;
  altura: number;
  color: string;
}) {
  return (
    <mesh position={[x, altura / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[ancho, altura, largo]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Calle({ ancho, largo, rotarZ = false }: { ancho: number; largo: number; rotarZ?: boolean }) {
  const args: [number, number] = rotarZ ? [largo * 0.6, ancho * 2.4] : [ancho * 2.4, largo * 0.6];
  return (
    <mesh
      position={rotarZ ? [ancho * 1.3, -0.03, 0] : [0, -0.03, largo * 1.3]}
      rotation={rotarZ ? [-Math.PI / 2, 0, Math.PI / 2] : [-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={args} />
      <meshStandardMaterial color="#6b7280" roughness={1} />
    </mesh>
  );
}

export function CasaViewer({ anchoTerreno, largoTerreno, numeroPisos, preferencias = "" }: Props) {
  const esEsquina = preferencias.toLowerCase().includes("esquina");

  const anchoConstruccion = anchoTerreno * 0.85;
  const largoConstruccion = largoTerreno * 0.85;
  const pisos = Array.from({ length: numeroPisos }, (_, i) => i);
  const alturaTecho = numeroPisos * ALTURA_POR_PISO + 1;

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border border-slate-200 bg-linear-to-b from-sky-200 to-slate-100">
      <Canvas
        shadows
        camera={{ position: [anchoTerreno * 1.6, anchoTerreno * 1.1, largoTerreno * 1.6], fov: 45 }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <hemisphereLight args={["#bfd9f2", "#8a9a6b", 0.4]} />

        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[anchoTerreno * 1.6, largoTerreno * 1.6]} />
          <meshStandardMaterial color="#a3b18a" roughness={1} />
        </mesh>

        <Calle ancho={anchoTerreno} largo={largoTerreno} />
        {esEsquina && <Calle ancho={anchoTerreno} largo={largoTerreno} rotarZ />}

        <CasaVecina
          x={-anchoTerreno * 1.05}
          ancho={anchoTerreno * 0.8}
          largo={largoTerreno * 0.9}
          altura={2.8}
          color="#c9c2b4"
        />
        {!esEsquina && (
          <CasaVecina
            x={anchoTerreno * 1.05}
            ancho={anchoTerreno * 0.8}
            largo={largoTerreno * 0.9}
            altura={5.6}
            color="#b8b0a0"
          />
        )}

        {pisos.map((i) => (
          <Piso
            key={i}
            ancho={anchoConstruccion}
            largo={largoConstruccion}
            y={ALTURA_POR_PISO / 2 + i * ALTURA_POR_PISO}
            color={COLORES_PISO[i % COLORES_PISO.length]}
          />
        ))}

        <Puerta x={0} largo={largoConstruccion} />

        {pisos.map((i) =>
          [-anchoConstruccion / 4, anchoConstruccion / 4].map((x, j) => (
            <Ventana
              key={`${i}-${j}`}
              x={x}
              y={ALTURA_POR_PISO * i + 1.7}
              largo={largoConstruccion}
            />
          ))
        )}

        <Techo ancho={anchoConstruccion} largo={largoConstruccion} y={alturaTecho} />

        <OrbitControls enablePan={false} minDistance={5} maxDistance={80} />
      </Canvas>
    </div>
  );
}