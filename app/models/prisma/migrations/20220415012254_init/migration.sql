/*
  Warnings:

  - You are about to drop the column `id_AM` on the `NotificationsAMToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationsAMToken" DROP COLUMN "id_AM",
ADD COLUMN     "agent_id" INTEGER;
