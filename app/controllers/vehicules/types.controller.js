const Joi = require("joi")
const typesService = require("../../services/vehicules/types.service");
const logger = require("../../services/logger");
const vehiclesService = require("../../services/vehicules/vehicles.service");

const getAllTypes = async (req, res) => {
// Invoke service
    const { code, data, serviceError, log } = await typesService.getAll();

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


const getType = async (req, res) => {
    const type = req.params.type
    const { code, data, serviceError, log } = await typesService.getType(type);

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

const addType = async (req, res) => {
    const validator = Joi.object({
        type: Joi.string().required(),
        price_per_hour: Joi.number().required(),
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
        price_per_hour,
    } = req.body;

    // Invoke service
    const { code, data, serviceError, log } = await typesService.addType(type, parseFloat(price_per_hour));

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

module.exports = {
    getAllTypes,
    getType,
    addType
}