const Joi = require("joi");
const reservationService = require('../../services/reservations/reservation.service') ;

// const unlockCar = async (reserv)=> {
//
// }
// const lockCar = async (reserv)=> {
//     reservationService.verrouillerVoiture(reserv) ;
// }


// Get pending reservations
const pending = async (req, res) => {
    const {code, data, serviceError, log} = await reservationService.pending()

    // Send response to client
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}

// Get validated reservations
const validated = async (req, res) => {
    const {code, data, serviceError, log} = await reservationService.validated()

    // Send response to client
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}

// Get completed reservations
const completed = async (req, res) => {
    const {code, data, serviceError, log} = await reservationService.completed()

    // Send response to client
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}

// Get rejected reservations
const rejected = async (req, res) => {
    const {code, data, serviceError, log} = await reservationService.rejected()
    // Send response to client
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}

const createReservation = async (req , res)=> {
    const validator = Joi.object({
        matricule: Joi.string().required(),
        locataire: Joi.string().email().required(),
        departLat: Joi.number().required(),
        departLong: Joi.number().required(),
        destLong: Joi.number().required(),
        destLat: Joi.number().required()
    })
    const {error} = validator.validate(req.body);
    if (error){
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {
        matricule,
        locataire,
        departLat,
        departLong,
        destLat,
        destLong
    } = req.body
    const {code, data, serviceError, log} = await reservationService.createReservation(matricule,locataire, departLat, departLong, destLat, destLong) ;

    // Send response to client
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }

}



const validateTrajet = async (req , res)=> {
    try {
        let reservation_id = parseInt(req.params.reservation_id)
        const {code, data, serviceError, log} = await reservationService.validateTrajet(reservation_id);
        if (!serviceError){
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
        }else{
            // Invoke error logger
            res.status(code).json(serviceError)
        }
    }catch (e){
        res.status(400).json("Reservation id must be a number")
    }


}
const verifyCode = async (req , res)=> {
    const validator = Joi.object({
        reservation_id: Joi.number().required(),
        code: Joi.string().required()
    });
    const {error} = validator.validate(req.body)
    if(error){
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {code, reservation_id} = req.body
    const {status, data, serviceError, log} = await reservationService.verifyCode(reservation_id, code)

}
const validateReservation = async (req, res)=> {
    try{
        let reservation_id = parseInt(req.params.reservation_id)
        const {code, data, serviceError, log} = await reservationService.validateReservation(reservation_id)

        // Send response to client
        if (!serviceError){
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
        }else{
            // Invoke error logger
            res.status(code).json(serviceError)
        }

    }catch (e) {
        res.status(400).json("Reservation must be a number")
    }
}



const rejectReservation = async (req, res) => {
    try{
        let reservation_id = parseInt(req.params.reservation_id)
        const {code, data, serviceError, log} = await reservationService.rejectReservation(reservation_id)

        // Send response to client
        if (!serviceError){
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
        }else{
            // Invoke error logger
            res.status(code).json(serviceError)
        }

    }catch (e) {
        res.status(400).json("Reservation must be a number")
    }
}

module.exports = {
    // unlockCar,
    // lockCar,
    createReservation ,
    validateTrajet ,
    verifyCode ,
    validateReservation,
    rejectReservation,
    pending,
    validated,
    completed,
    rejected
}
