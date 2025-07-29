-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "autenticado" BOOLEAN NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);
