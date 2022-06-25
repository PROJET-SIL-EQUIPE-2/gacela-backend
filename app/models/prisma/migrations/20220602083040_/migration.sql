/*
  Warnings:

  - You are about to drop the column `facture_id` on the `Paiment` table. All the data in the column will be lost.
  - You are about to drop the column `price_per_hour` on the `Vehicules` table. All the data in the column will be lost.
  - The `type_vehicule` column on the `Vehicules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Facture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "Paiment" DROP CONSTRAINT "Paiment_facture_id_fkey";

-- AlterTable
ALTER TABLE "Paiment" DROP COLUMN "facture_id",
ADD COLUMN     "estimated_price" DOUBLE PRECISION,
ADD COLUMN     "real_price" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "reservation_id" INTEGER,
ALTER COLUMN "date_paiment" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Reservations" ADD COLUMN     "real_end_course" TIMESTAMP(3),
ADD COLUMN     "real_start_course" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "completed" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Vehicules" DROP COLUMN "price_per_hour",
ADD COLUMN     "region" INTEGER,
DROP COLUMN "type_vehicule",
ADD COLUMN     "type_vehicule" INTEGER;

-- DropTable
DROP TABLE "Facture";

-- CreateTable
CREATE TABLE "Refund" (
    "refund_id" SERIAL NOT NULL,
    "paiment_id" INTEGER,
    "amount" INTEGER,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("refund_id")
);

-- CreateTable
CREATE TABLE "VehiculeType" (
    "type_id" SERIAL NOT NULL,
    "type" TEXT,
    "price_per_hour" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "VehiculeType_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "Region" (
    "region_id" SERIAL NOT NULL,
    "region_name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "ReservationRegion" (
    "id" SERIAL NOT NULL,
    "region_id" INTEGER NOT NULL,
    "reservation_id" INTEGER NOT NULL,

    CONSTRAINT "ReservationRegion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehiculeType_type_key" ON "VehiculeType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Region_region_name_key" ON "Region"("region_name");

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paiment_id_fkey" FOREIGN KEY ("paiment_id") REFERENCES "Paiment"("paiment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Paiment" ADD CONSTRAINT "Paiment_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "Reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicules" ADD CONSTRAINT "Vehicules_type_vehicule_fkey" FOREIGN KEY ("type_vehicule") REFERENCES "VehiculeType"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicules" ADD CONSTRAINT "Vehicules_region_fkey" FOREIGN KEY ("region") REFERENCES "Region"("region_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservationRegion" ADD CONSTRAINT "ReservationRegion_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "Reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservationRegion" ADD CONSTRAINT "ReservationRegion_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("region_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
