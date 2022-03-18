-- AlterTable
CREATE SEQUENCE "admins_admin_id_seq";
ALTER TABLE "Admins" ALTER COLUMN "admin_id" SET DEFAULT nextval('admins_admin_id_seq');
ALTER SEQUENCE "admins_admin_id_seq" OWNED BY "Admins"."admin_id";
