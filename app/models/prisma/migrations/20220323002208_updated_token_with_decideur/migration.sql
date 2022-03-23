-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "id_decideur" INTEGER;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_decideur_fkey" FOREIGN KEY ("id_decideur") REFERENCES "Decideurs"("decideur_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
