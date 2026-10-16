-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requerimiento" (
    "id" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    "anchoTerreno" DOUBLE PRECISION NOT NULL,
    "largoTerreno" DOUBLE PRECISION NOT NULL,
    "numeroPisos" INTEGER NOT NULL,
    "ambientes" TEXT NOT NULL,
    "preferencias" TEXT NOT NULL,
    "presupuestoMinimo" DOUBLE PRECISION,
    "presupuestoMaximo" DOUBLE PRECISION,
    "plantilla3D" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Requerimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Requerimiento" ADD CONSTRAINT "Requerimiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
