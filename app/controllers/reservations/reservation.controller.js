const Joi = require("joi");
const reservationService = require('../../services/reservations/reservation.service');
const logger = require("../../services/logger")
const { loggers } = require("winston");
// const unlockCar = async (reserv)=> {
//
// }
// const lockCar = async (reserv)=> {
//     reservationService.verrouillerVoiture(reserv) ;
// }


// Get pending reservations
const pending = async (req, res) => {
    const { code, data, serviceError, log } = await reservationService.pending()

    // Send response to client
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    } else {
        // Invoke error logger
        res.status(code).json(serviceError)
        logger.error(log)
    }
}

// Get validated reservations
const validated = async (req, res) => {
    const { code, data, serviceError, log } = await reservationService.validated()

    // Send response to client
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    } else {
        // Invoke error logger
        res.status(code).json(serviceError)
        logger.error(log)

    }
}

// Get completed reservations
const completed = async (req, res) => {
    const { code, data, serviceError, log } = await reservationService.completed()

    // Send response to client
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)

    } else {
        // Invoke error logger
        res.status(code).json(serviceError)
        logger.error(log)

    }
}

// Get rejected reservations
const rejected = async (req, res) => {
    const { code, data, serviceError, log } = await reservationService.rejected()
    // Send response to client
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)

    } else {
        // Invoke error logger
        res.status(code).json(serviceError)
        logger.error(log)

    }
}

const createReservation = async (req, res) => {
    const validator = Joi.object({
        matricule: Joi.string().required(),
        locataire: Joi.string().email().required(),
        departLat: Joi.number().required(),
        departLong: Joi.number().required(),
        destLong: Joi.number().required(),
        destLat: Joi.number().required()
    })
    const { error } = validator.validate(req.body);
    if (error) {
        logger.error(error.details[0].message)

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
    const { code, data, serviceError, log } = await reservationService.createReservation(matricule, locataire, departLat, departLong, destLat, destLong);

    // Send response to client
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    } else {
        // Invoke error logger
        res.status(code).json(serviceError)
        logger.error(log)

    }

}



const validateTrajet = async (req, res) => {
    try {
        let reservation_id = parseInt(req.params.reservation_id)
        const { code, data, serviceError, log } = await reservationService.validateTrajet(reservation_id);
        if (!serviceError) {
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
            logger.debug(log)

        } else {
            // Invoke error logger
            res.status(code).json(serviceError)
            logger.error(log)

        }
    } catch (e) {
        res.status(400).json("Reservation id must be a number")
    }


}
const verifyCode = async (req, res) => {
    const validator = Joi.object({
        reservation_id: Joi.number().required(),
        code: Joi.string().required()
    });
    const { error } = validator.validate(req.body)
    if (error) {
        logger.error(error.details[0].message)

        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const { code, reservation_id } = req.body
    const { status, data, serviceError, log } = await reservationService.verifyCode(reservation_id, code)
    if (!serviceError) {
        // Send  message to user
        res.status(status).json(data)
        // Invoke logger
        logger.debug(log)


    } else {
        // Invoke error logger
        res.status(status).json(serviceError)
        logger.error(log)

    }
}
const validateReservation = async (req, res) => {

    const validator = Joi.object({
        reservation_id: Joi.number().required(),
        locataire_email: Joi.string().email().required()
    })
    const { error } = validator.validate(req.body)
    if (error) {
        logger.error(error.details[0].message)
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const { reservation_id, locataire_email } = req.body
    const { code, data, serviceError, log } = await reservationService.validateReservation(reservation_id, locataire_email)

    // Send response to client
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)

    } else {
        // Invoke error logger
        logger.error(log)

        console.error(serviceError)
        res.status(code).json(data)
    }


}



const rejectReservation = async (req, res) => {
    try {
        let reservation_id = parseInt(req.params.reservation_id)
        const { code, data, serviceError, log } = await reservationService.rejectReservation(reservation_id)

        // Send response to client
        if (!serviceError) {
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
            logger.debug(log)

        } else {
            // Invoke error logger
            logger.error(log)

            res.status(code).json(serviceError)
        }

    } catch (e) {
        res.status(400).json("Reservation must be a number")
    }
}


const history = async (req, res) => {
    const validator = Joi.object({
        locataire_email: Joi.string().email().required()
    })
    const { error } = validator.validate(req.body)
    if (error) {
        logger.error(error.details[0].message)
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {locataire_email} = req.body
    const {code, data, serviceError, log} = await reservationService.history(locataire_email)
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)

    } else {
        // Invoke error logger
        logger.error(log)

        res.status(code).json(serviceError)
    }
}

module.exports = {
    // unlockCar,
    // lockCar,
    createReservation,
    validateTrajet,
    verifyCode,
    validateReservation,
    rejectReservation,
    pending,
    validated,
    completed,
    rejected,
    history
}
