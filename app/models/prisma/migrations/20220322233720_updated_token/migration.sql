-- CreateTable
CREATE TABLE "Admins" (
    "admin_id" SERIAL NOT NULL,
    "nom" VARCHAR,
    "prenom" VARCHAR,
    "email" VARCHAR,
    "isSuperAdmin" BOOLEAN,
    "password" VARCHAR,

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

    CONSTRAINT "AgentsMaintenance_pkey" PRIMARY KEY ("agent_id")
);

-- CreateTable
CREATE TABLE "Decideurs" (
    "decideur_id" SERIAL NOT NULL,
    "nom" VARCHAR,
    "prenom" VARCHAR,
    "phone_number" VARCHAR,
    "email" VARCHAR,
    "password" VARCHAR,

    CONSTRAINT "Decideurs_pkey" PRIMARY KEY ("decideur_id")
);

-- CreateTable
CREATE TABLE "DemandesInscription" (
    "demande_id" SERIAL NOT NULL,
    "locataire_id" INTEGER,
    "date_demande" TIMESTAMP(6),
    "etat_demande" INTEGER,

    CONSTRAINT "DemandesInscription_pkey" PRIMARY KEY ("demande_id")
);

-- CreateTable
CREATE TABLE "DemandesInscriptionRejected" (
    "demande_id" SERIAL NOT NULL,
    "justificatif" VARCHAR,

    CONSTRAINT "DemandesInscriptionRejected_pkey" PRIMARY KEY ("demande_id")
);

-- CreateTable
CREATE TABLE "DemandesReservation" (
    "demande_id" SERIAL NOT NULL,
    "locataire_id" INTEGER,
    "etat_reservation" VARCHAR,
    "date_reservation" DATE,
    "start_point" point,
    "end_point" point,

    CONSTRAINT "DemandesReservation_pkey" PRIMARY KEY ("demande_id")
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
CREATE TABLE "EtatDemandeInscription" (
    "etat_id" SERIAL NOT NULL,
    "description" VARCHAR,

    CONSTRAINT "EtatDemandeInscription_pkey" PRIMARY KEY ("etat_id")
);

-- CreateTable
CREATE TABLE "EtatVehicule" (
    "etat_id" SERIAL NOT NULL,
    "description" VARCHAR,

    CONSTRAINT "EtatVehicule_pkey" PRIMARY KEY ("etat_id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "facture_id" SERIAL NOT NULL,
    "trajet_id" INTEGER,
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
CREATE TABLE "Trajets" (
    "trajet_id" SERIAL NOT NULL,
    "locataire_id" INTEGER,
    "vehicule_id" INTEGER,
    "demande_id" INTEGER,
    "etat" VARCHAR,

    CONSTRAINT "Trajets_pkey" PRIMARY KEY ("trajet_id")
);

-- CreateTable
CREATE TABLE "TypePaiment" (
    "type_id" SERIAL NOT NULL,
    "description" VARCHAR,

    CONSTRAINT "TypePaiment_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "TypesVehicules" (
    "type_id" SERIAL NOT NULL,
    "description" VARCHAR,
    "unit_price" DOUBLE PRECISION,

    CONSTRAINT "TypesVehicules_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "Vehicules" (
    "vehicule_id" SERIAL NOT NULL,
    "responsable" INTEGER,
    "type_vehicule" INTEGER,
    "kilometrage" DOUBLE PRECISION,
    "etat_vehicule" INTEGER,

    CONSTRAINT "Vehicules_pkey" PRIMARY KEY ("vehicule_id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "id_locataire" INTEGER,
    "id_AM" INTEGER,
<<<<<<< HEAD:app/models/prisma/migrations/20220323004312_init/migration.sql
=======
    "id_admin" INTEGER,
>>>>>>> 4fd8d36aaacad97307d9954397eda6aad224aa9f:app/models/prisma/migrations/20220322233720_updated_token/migration.sql
    "email" VARCHAR,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

<<<<<<< HEAD:app/models/prisma/migrations/20220323004312_init/migration.sql
-- CreateTable
CREATE TABLE "TokenAdmin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" VARCHAR,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenAdmin_pkey" PRIMARY KEY ("id")
);

=======
>>>>>>> 4fd8d36aaacad97307d9954397eda6aad224aa9f:app/models/prisma/migrations/20220322233720_updated_token/migration.sql
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

-- AddForeignKey
ALTER TABLE "DemandesInscription" ADD CONSTRAINT "DemandesInscription_etat_demande_fkey" FOREIGN KEY ("etat_demande") REFERENCES "EtatDemandeInscription"("etat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DemandesInscription" ADD CONSTRAINT "DemandesInscription_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DemandesInscriptionRejected" ADD CONSTRAINT "DemandesInscriptionRejected_demande_id_fkey" FOREIGN KEY ("demande_id") REFERENCES "DemandesInscription"("demande_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DemandesReservation" ADD CONSTRAINT "DemandesReservation_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DemandesSupport" ADD CONSTRAINT "DemandesSupport_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_trajet_id_fkey" FOREIGN KEY ("trajet_id") REFERENCES "Trajets"("trajet_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NotificationsAM" ADD CONSTRAINT "NotificationsAM_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NotificationsLocataire" ADD CONSTRAINT "NotificationsLocataire_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Paiment" ADD CONSTRAINT "Paiment_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "Facture"("facture_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Paiment" ADD CONSTRAINT "Paiment_type_paiment_fkey" FOREIGN KEY ("type_paiment") REFERENCES "TypePaiment"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Panne" ADD CONSTRAINT "Panne_vehicule_id_fkey" FOREIGN KEY ("vehicule_id") REFERENCES "Vehicules"("vehicule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trajets" ADD CONSTRAINT "Trajets_demande_id_fkey" FOREIGN KEY ("demande_id") REFERENCES "DemandesReservation"("demande_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trajets" ADD CONSTRAINT "Trajets_locataire_id_fkey" FOREIGN KEY ("locataire_id") REFERENCES "Locataires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trajets" ADD CONSTRAINT "Trajets_vehicule_id_fkey" FOREIGN KEY ("vehicule_id") REFERENCES "Vehicules"("vehicule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicules" ADD CONSTRAINT "Vehicules_responsable_fkey" FOREIGN KEY ("responsable") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicules" ADD CONSTRAINT "Vehicules_etat_vehicule_fkey" FOREIGN KEY ("etat_vehicule") REFERENCES "EtatVehicule"("etat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicules" ADD CONSTRAINT "Vehicules_type_vehicule_fkey" FOREIGN KEY ("type_vehicule") REFERENCES "TypesVehicules"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Vehicules" ADD CONSTRAINT "Vehicules_etat_vehicule_fkey1" FOREIGN KEY ("etat_vehicule") REFERENCES "Vehicules"("vehicule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
<<<<<<< HEAD:app/models/prisma/migrations/20220323004312_init/migration.sql
=======
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "Admins"("admin_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
>>>>>>> 4fd8d36aaacad97307d9954397eda6aad224aa9f:app/models/prisma/migrations/20220322233720_updated_token/migration.sql
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_AM_fkey" FOREIGN KEY ("id_AM") REFERENCES "AgentsMaintenance"("agent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_id_locataire_fkey" FOREIGN KEY ("id_locataire") REFERENCES "Locataires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
