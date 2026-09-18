-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Requerimiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "anchoTerreno" REAL NOT NULL,
    "largoTerreno" REAL NOT NULL,
    "numeroPisos" INTEGER NOT NULL,
    "ambientes" TEXT NOT NULL,
    "preferencias" TEXT NOT NULL,
    "presupuestoMinimo" REAL,
    "presupuestoMaximo" REAL,
    "plantilla3D" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT "Requerimiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
