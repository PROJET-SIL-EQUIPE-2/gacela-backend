-- AlterTable
ALTER TABLE "Admins" ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "AgentsMaintenance" ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Decideurs" ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Locataires" ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false;
