// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// En desarrollo, Next.js recarga el código muy seguido.
// Sin este truco, cada recarga crearía una nueva conexión a la base de datos
// y eventualmente se agotarían las conexiones disponibles.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}