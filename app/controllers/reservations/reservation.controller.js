const reservationService = require('../../services/reservation.service') ;
const deverouillerVoiture = (reserv)=> {

}
const verrouillerVoiture = (reserv)=> {
    reservationService.verrouillerVoiture(reserv) ;

}
const createReservation = (req , res)=> {
    reservationService.createReservation(req, res) ;

} 
const validerTrajet = (req , res)=> {
    reservationService.validerTrajet(req, res) ;

}
const verifyCode = (req , res)=> {
    reservationService.verifyCode(req, res) ;

}
const validerReservation = (reserv)=> {
    reservationService()

}

module.exports = {
    deverouillerVoiture,
    verrouillerVoiture,
    createReservation , 
    validerTrajet ,
    verifyCode ,
    validerReservation 

    
    
}
