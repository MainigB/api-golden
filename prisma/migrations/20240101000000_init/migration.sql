-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "cliente" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL,
    "desc" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "resumo" TEXT,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

