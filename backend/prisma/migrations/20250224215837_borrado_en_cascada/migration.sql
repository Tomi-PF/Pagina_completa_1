-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_id_ciudad_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_id_ciudad_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_id_hotel_fkey";

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "Ciudad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_id_hotel_fkey" FOREIGN KEY ("id_hotel") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
