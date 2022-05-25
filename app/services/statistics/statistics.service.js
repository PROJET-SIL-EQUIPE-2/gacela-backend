const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const getNbrDemandesAcceptSemaine = async (weekNumber , month , year ) => {
    weekNumber = Number(weekNumber);
    month = Number(month);
    year = Number(year);
    const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *,  DATEPART(week, date_reservation) AS WEEK,  EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND WEEK=${weekNumber} AND etat=COMPLETED OR etat=ENCOURS`
    return result ;
}

const getNbrDemandesRejetSemaine = async (weekNumber , month , year ) => {
    weekNumber = Number(weekNumber);
    month = Number(month);
    year = Number(year);
    const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *,  DATEPART(week, date_reservation) AS WEEK,  EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND WEEK=${weekNumber} AND etat=REJECTED`
    return result ;

}

const getNbrDemandesAcceptMois = async (month , year) => {
    month = Number(month);
    year = Number(year);
    const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND etat=COMPLETED OR etat=ENCOURS`
    return result ;

}

const getNbrDemandesRejetMois = async (month , year) => {
    month = Number(month);
    year = Number(year);
    const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(MONTH FROM date_reservation) AS MONTH, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE MONTH=${month} AND YEAR=${year} AND etat=REJECTED`
    return result ;

}

const getNbrDemandesAcceptAnnee = async (year) => {
    year = Number(year);
    const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE YEAR=${year} AND etat=COMPLETED OR etat=ENCOURS`
    return result ;

}

const getNbrDemandesRejetAnnee = async (year) => {
    year = Number(year);
    const result = await prisma.$queryRaw`SELECT count(*) FROM  (SELECT *, EXTRACT(YEAR FROM date_reservation) AS YEAR FROM Reservations) WHERE YEAR=${year} AND etat=REJECTED`
    return result ;

}


const getNbrInscriptionsSemaine = async () => {

}

const getNbrInscriptionsMois = async () => {

}

const getNbrInscriptionsAnnee = async () => {

}

