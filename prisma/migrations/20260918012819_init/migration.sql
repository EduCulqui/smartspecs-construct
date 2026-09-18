-- CreateTable
CREATE TABLE "Requerimiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anchoTerreno" REAL NOT NULL,
    "largoTerreno" REAL NOT NULL,
    "numeroPisos" INTEGER NOT NULL,
    "ambientes" TEXT NOT NULL,
    "preferencias" TEXT NOT NULL,
    "presupuestoMinimo" REAL,
    "presupuestoMaximo" REAL,
    "plantilla3D" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE'
);
