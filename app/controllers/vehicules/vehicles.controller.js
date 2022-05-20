const Joi = require("joi")
const vehiclesService = require("../../services/vehicules/vehicles.service");
const logger = require("../../services/logger");
const reservationService = require("../../services/reservations/reservation.service");


// TODO: Add only query parameter
const getAllVehicles = async (req, res) => {
    // Check if type is present
    const type = req.params.type
    // Invoke service
    const { code, data, serviceError, log } = await vehiclesService.getAll(type);

    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    } else {
        // Invoke error logger
        logger.error(log);
        res.status(code).json(data);
    }
}

const getVehicleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Invoke service
        const { code, data, serviceError, log } = await vehiclesService.getById(id);
        if (!serviceError) {
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
            logger.debug(log)
        } else {
            // Invoke error logger
            logger.error(log);
            res.status(code).json(data);
        }
    } catch (e) {
        res.json("Number my be provided");
    }
}

const getAvailable = async (req, res) => {
    const { code, data, serviceError } = await vehiclesService.getAvailable();

    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    } else {
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
    }
}

const getReserved = async (req, res) => {
    const { code, data, serviceError } = await vehiclesService.getReserved();

    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    } else {
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
    }
}

const getDefective = async (req, res) => {
    const { code, data, serviceError } = await vehiclesService.getDefective();

    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    } else {
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
    }
}


const addVehicle = async (req, res) => {
    const validator = Joi.object({
        type: Joi.string().required(),
        mileage: Joi.number().required(),
        price_per_hour: Joi.number().required(),
        matricule: Joi.string().min(8).required()
    })
    const { error } = validator.validate(req.body);
    if (error) {

        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract data
    const {
        type,
        mileage,
        price_per_hour,
        matricule
    } = req.body;

    // Invoke service
    const { code, data, serviceError, log } = await vehiclesService.addVehicle(type, parseFloat(mileage), parseFloat(price_per_hour));

    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    } else {
        // Invoke error logger
        logger.error(log);
        res.status(code).json(data);
    }
}

const deleteVehicle = async (req, res) => {
    // Delete vehicule by id
    try {
        const id = parseInt(req.params.id);

        // Invoke service
        const { code, data, serviceError, log } = await vehiclesService.deleteVehicule(id);

        if (!serviceError) {
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
            logger.debug(log)
        } else {
            // Invoke error logger
            logger.error(log);
            res.status(code).json(data);
        }

    } catch (e) {
        res.json("Number must be provided");
    }
}

const assign = async (req, res) => {
    const validator = Joi.object({
        matricule: Joi.string().required(),
        email: Joi.string().email().required()
    })

    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const { matricule, email } = req.body;

    const { code, data, serviceError, log } = await vehiclesService.assign(matricule, email);
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    } else {
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(data)
    }
}

const unassign = async (req, res) => {
    const validator = Joi.object({
        matricule: Joi.string().required(),
        email: Joi.string().email().required()
    })

    const { error } = validator.validate(req.body);
    if (error) {
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const { matricule, email } = req.body;

    const { code, data, serviceError, log } = await vehiclesService.unassign(matricule, email);
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    } else {
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(data)
    }
}



const search = async (req, res) => {
    const validator = Joi.object({
        type: Joi.string().required(),
        departLat: Joi.number().required(),
        departLong: Joi.number().required()
    })

    const {error} = validator.validate(req.body);
    if (error){
        logger.error(error.details[0].message)

        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {
        type,
        departLat,
        departLong,
    } = req.body
    const {code, data, serviceError, log} = await reservationService.search(type, departLat, departLong) ;

    // Send response to client
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
        logger.error(log)

    }
}

module.exports = {
    getAllVehicles,
    getVehicleById,
    getAvailable,
    getReserved,
    getDefective,
    addVehicle,
    deleteVehicle,
    assign,
    unassign,
    search
}