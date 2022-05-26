const statisticsService = require("../../services/statistics/statistics.service")
//TODO: REQ, RES after the test
const getNbrDemandesAcceptSemaine = async (req , res ) => {
    
    weekNumber = Number(req.body.weekNumber);
    month = Number(req.body.month);
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrDemandesAcceptSemaine(weekNumber, month, year) ;
    if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}

const getNbrDemandesRejetSemaine = async (req , res ) => {
    weekNumber = Number(req.body.weekNumber);
    month = Number(req.body.month);
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrDemandesRejetSemaine(weekNumber, month, year)
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}

const getNbrDemandesAcceptMois = async (req , res) => {
    month = Number(req.body.month);
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrDemandesAcceptMois(month, year) ;
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}

const getNbrDemandesRejetMois = async (req , res ) => {
    month = Number(req.body.month);
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrDemandesRejetMois(month, year) ;
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}

const getNbrDemandesAcceptAnnee = async (req , res ) => {
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrDemandesAcceptAnnee(year) ;
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}

const getNbrDemandesRejetAnnee = async (req , res ) => {
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrDemandesRejetAnnee(year);
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}



const getNbrInscriptionsSemaine = async (req , res ) => {
    weekNumber = Number(req.body.weekNumber);
    month = Number(req.body.month);
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrInscriptionsSemaine(weekNumber, month, year) ;
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}

const getNbrInscriptionsMois = async (req , res ) => {
    month = Number(req.body.month);
    year = Number(req.body.year);
    const {code, data, error} = await getNbrInscriptionsMois(month, year);
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }

}

const getNbrInscriptionsAnnee = async (req , res ) => {
    year = Number(req.body.year);
    const {code, data, error} = await statisticsService.getNbrInscriptionsAnnee(year);
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }

}


const getFinanceSemaine = async (req , res ) => {
    weekNumber = Number(req.body.weekNumber);
    month = Number(req.body.month);
    year = Number(req.body.year);
    
    const {code, data, error} = await statisticsService.getFinanceSemaine(weekNumber, month, year) ;
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
}

const getFinanceMois = async (req , res ) => {
    month = Number(req.body.month);
    year = Number(req.body.year);
    
    const {code, data, error} = await statisticsService.getFinanceMois(month, year) ;
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }

}

const getFinanceAnnee = async (req , res ) => {
    year = Number(req.body.year);
  
    const {code, data, error} = await statisticsService.getFinanceAnnee(year) ;
     if (!error){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(error);
        res.status(code).json(error)
    }
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
    getNbrInscriptionsSemaine ,
    getFinanceSemaine , 
    getFinanceMois , 
    getFinanceAnnee
}