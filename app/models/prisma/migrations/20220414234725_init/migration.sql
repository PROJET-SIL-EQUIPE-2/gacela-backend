-- AlterTable
ALTER TABLE "Vehicules" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "NotificationsAMToken" (
    "id" SERIAL NOT NULL,
    "id_AM" INTEGER,
    "token" TEXT,

    CONSTRAINT "NotificationsAMToken_pkey" PRIMARY KEY ("id")
);
