/*
  Warnings:

  - You are about to drop the column `user_id` on the `Token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "user_id",
ADD COLUMN     "id_AM" INTEGER,
ADD COLUMN     "id_locataire" INTEGER;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_AM_fkey" FOREIGN KEY ("id_AM") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_locataire_fkey" FOREIGN KEY ("id_locataire") REFERENCES "Locataires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
