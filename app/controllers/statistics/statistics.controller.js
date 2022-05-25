const statisticsService = require("../../services/statistics/statistics.service")

const getNbrDemandesAcceptSemaine = async (weekNumber , month , year ) => {
    weekNumber = Number(weekNumber);
    month = Number(month);
    year = Number(year);
    return statisticsService.getNbrDemandesAcceptSemaine(weekNumber, month, year) ;
}

const getNbrDemandesRejetSemaine = async (weekNumber , month , year ) => {
    weekNumber = Number(weekNumber);
    month = Number(month);
    year = Number(year);
    return statisticsService.getNbrDemandesRejetSemaine(weekNumber, month, year)

}

const getNbrDemandesAcceptMois = async (month , year) => {
    month = Number(month);
    year = Number(year);
    return statisticsService.getNbrDemandesAcceptMois(month, year) ;

}

const getNbrDemandesRejetMois = async (month , year) => {
    month = Number(month);
    year = Number(year);
    return statisticsService.getNbrDemandesRejetMois(month, year) ;

}

const getNbrDemandesAcceptAnnee = async (year) => {
    year = Number(year);
    return statisticsService.getNbrDemandesAcceptAnnee(year) ;

}

const getNbrDemandesRejetAnnee = async (year) => {
    year = Number(year);
    return statisticsService.getNbrDemandesRejetAnnee(year);

}



const getNbrInscriptionsSemaine = async (weekNumber , month , year) => {
    weekNumber = Number(weekNumber);
    month = Number(month);
    year = Number(year);
    return statisticsService.getNbrInscriptionsSemaine(weekNumber, month, year) ;

}

const getNbrInscriptionsMois = async (month , year) => {
    month = Number(month);
    year = Number(year);
    return getNbrInscriptionsMois(month, year);


}

const getNbrInscriptionsAnnee = async (year) => {
    year = Number(year);
    return statisticsService.getNbrInscriptionsAnnee(year);


}

module.exports = {
    getNbrDemandesAcceptAnnee , 
    getNbrDemandesAcceptMois , 
    getNbrDemandesAcceptSemaine , 
    getNbrDemandesRejetAnnee , 
    getNbrDemandesRejetMois , 
    getNbrDemandesRejetSemaine , 
    getNbrInscriptionsAnnee , 
    getNbrInscriptionsMois , 
    getNbrInscriptionsSemaine 
}