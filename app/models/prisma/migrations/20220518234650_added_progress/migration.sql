/*
  Warnings:

  - You are about to drop the column `position` on the `Panne` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Panne" DROP COLUMN "position";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "progress" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "VehiculesStatus" (
    "matricule" TEXT NOT NULL,
    "collection_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "charge" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "long" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "VehiculesStatusHistory" (
    "matricule" TEXT NOT NULL,
    "collection_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "charge" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "long" DOUBLE PRECISION
);

-- CreateIndex
CREATE UNIQUE INDEX "VehiculesStatus_matricule_key" ON "VehiculesStatus"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "VehiculesStatusHistory_matricule_collection_time_key" ON "VehiculesStatusHistory"("matricule", "collection_time");

-- AddForeignKey
ALTER TABLE "VehiculesStatus" ADD CONSTRAINT "VehiculesStatus_matricule_fkey" FOREIGN KEY ("matricule") REFERENCES "Vehicules"("matricule") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VehiculesStatusHistory" ADD CONSTRAINT "VehiculesStatusHistory_matricule_fkey" FOREIGN KEY ("matricule") REFERENCES "Vehicules"("matricule") ON DELETE NO ACTION ON UPDATE NO ACTION;
