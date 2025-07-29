-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_nacimiento" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);
