-- CreateEnum
CREATE TYPE "EtatDemande" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EtatReservation" AS ENUM ('INVALIDE', 'ENCOURS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VehicleState" AS ENUM ('WORKING', 'OUTOFORDER');

-- CreateTable
CREATE TABLE "Admins" (
    "admin_id" SERIAL NOT NULL,
    "name" VARCHAR,
    "family_name" VARCHAR,
    "email" VARCHAR,
    "isSuperAdmin" BOOLEAN,
    "password" VARCHAR,
    "blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "AgentsMaintenance" (
    "agent_id" SERIAL NOT NULL,
    "email" VARCHAR,
    "phone_number" VARCHAR,
    "password" VARCHAR,
    "family_name" VARCHAR,
    "name" VARCHAR,
    "blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AgentsMaintenance_pkey" PRIMARY KEY ("agent_id")
);

-- CreateTable
CREATE TABLE "Decideurs" (
    "decideur_id" SERIAL NOT NULL,
    "name" VARCHAR,
    "family_name" VARCHAR,
    "phone_number" VARCHAR,
    "email" VARCHAR,
    "password" VARCHAR,
    "blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Decideurs_pkey" PRIMARY KEY ("decideur_id")
);

-- CreateTable
CREATE TABLE "DemandesInscription" (
    "demande_id" SERIAL NOT NULL,
    "locataire_id" INTEGER,
    "date_demande" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "etat_demande" "EtatDemande" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "DemandesInscription_pkey" PRIMARY KEY ("demande_id")
);

-- CreateTable
CREATE TABLE "DemandesInscriptionRejected" (
    "demande_id" SERIAL NOT NULL,
    "justificatif" VARCHAR,

    CONSTRAINT "DemandesInscriptionRejected_pkey" PRIMARY KEY ("demande_id")
);

-- CreateTable
CREATE TABLE "DemandesSupport" (
    "demande_id" SERIAL NOT NULL,
    "locataire_id" INTEGER,
    "message" VARCHAR,
    "date_demande" TIMESTAMP(6),

    CONSTRAINT "DemandesSupport_pkey" PRIMARY KEY ("demande_id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "facture_id" SERIAL NOT NULL,
    "reservation_id" INTEGER,
    "price" INTEGER,
    "paid" BOOLEAN,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("facture_id")
);

-- CreateTable
CREATE TABLE "Locataires" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR,
    "phone_number" VARCHAR,
    "password" VARCHAR,
    "photo_identity" VARCHAR,
    "personal_photo" VARCHAR,
    "family_name" VARCHAR,
    "name" VARCHAR,
    "validated" BOOLEAN DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Locataires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationsAM" (
    "notif_id" SERIAL NOT NULL,
    "agent_id" INTEGER,
    "date_notif" TIMESTAMP(6),
    "titre" VARCHAR,
    "message" VARCHAR,

    CONSTRAINT "NotificationsAM_pkey" PRIMARY KEY ("notif_id")
);

-- CreateTable
CREATE TABLE "NotificationsLocataire" (
    "notif_id" SERIAL NOT NULL,
    "locataire_id" INTEGER,
    "date_notif" DATE,
    "titre" VARCHAR,
    "message" VARCHAR,

    CONSTRAINT "NotificationsLocataire_pkey" PRIMARY KEY ("notif_id")
);

-- CreateTable
CREATE TABLE "Paiment" (
    "paiment_id" SERIAL NOT NULL,
    "facture_id" INTEGER,
    "date_paiment" TIMESTAMP(6),
    "type_paiment" INTEGER,

    CONSTRAINT "Paiment_pkey" PRIMARY KEY ("paiment_id")
);

-- CreateTable
CREATE TABLE "Panne" (
    "panne_id" SERIAL NOT NULL,
    "vehicule_id" INTEGER,
    "charge" DOUBLE PRECISION,
    "date_panne" TIMESTAMP(6),
    "temperature" DOUBLE PRECISION,
    "blocked" BOOLEAN,
    "position" point,
    "treated" BOOLEAN,

    CONSTRAINT "Panne_pkey" PRIMARY KEY ("panne_id")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_id" SERIAL NOT NULL,
    "agent_id" INTEGER,
    "_date" DATE,
    "panne_id" INTEGER,
    "description" VARCHAR,
    "completed" BOOLEAN,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "Reservations" (
    "reservation_id" SERIAL NOT NULL,
    "locataire_id" INTEGER NOT NULL,
    "vehicule_id" INTEGER NOT NULL,
    "code" TEXT,
    "etat" "EtatReservation" DEFAULT E'INVALIDE',
    "departLat" DOUBLE PRECISION,
    "departLong" DOUBLE PRECISION,
    "destLat" DOUBLE PRECISION,
    "destLong" DOUBLE PRECISION,
    "date_reservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "TypePaiment" (
    "type_id" SERIAL NOT NULL,
    "description" VARCHAR,

    CONSTRAINT "TypePaiment_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "Vehicules" (
    "vehicule_id" SERIAL NOT NULL,
    "matricule" TEXT NOT NULL,
    "car_photo" TEXT,
    "responsable" INTEGER,
    "type_vehicule" TEXT NOT NULL,
    "kilometrage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "etat" "VehicleState" NOT NULL DEFAULT E'WORKING',
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "price_per_hour" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Vehicules_pkey" PRIMARY KEY ("vehicule_id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "id_locataire" INTEGER,
    "id_AM" INTEGER,
    "id_admin" INTEGER,
    "id_decideur" INTEGER,
    "email" VARCHAR,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admins_email_key" ON "Admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agent_unique_email" ON "AgentsMaintenance"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Decideurs_email_key" ON "Decideurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "demande_unique_locataire" ON "DemandesInscription"("locataire_id");

-- CreateIndex
CREATE UNIQUE INDEX "locataire_email_unique" ON "Locataires"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_matricule" ON "Vehicules"("matricule");

-- AddForeignKey
ALTER TABLE "DemandesInscription" ADD CONSTRAINT "DemandesInscription_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DemandesInscriptionRejected" ADD CONSTRAINT "DemandesInscriptionRejected_demande_id_fkey" FOREIGN KEY ("demande_id") REFERENCES "DemandesInscription"("demande_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DemandesSupport" ADD CONSTRAINT "DemandesSupport_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "Reservations"("reservation_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NotificationsAM" ADD CONSTRAINT "NotificationsAM_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NotificationsLocataire" ADD CONSTRAINT "NotificationsLocataire_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Paiment" ADD CONSTRAINT "Paiment_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "Facture"("facture_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Paiment" ADD CONSTRAINT "Paiment_type_paiment_fkey" FOREIGN KEY ("type_paiment") REFERENCES "TypePaiment"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Panne" ADD CONSTRAINT "Panne_vehicule_id_fkey" FOREIGN KEY ("vehicule_id") REFERENCES "Vehicules"("vehicule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_vehicule_id_fkey" FOREIGN KEY ("vehicule_id") REFERENCES "Vehicules"("vehicule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicules" ADD CONSTRAINT "Vehicules_responsable_fkey" FOREIGN KEY ("responsable") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_AM_fkey" FOREIGN KEY ("id_AM") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_decideur_fkey" FOREIGN KEY ("id_decideur") REFERENCES "Decideurs"("decideur_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_locataire_fkey" FOREIGN KEY ("id_locataire") REFERENCES "Locataires"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
