const Joi = require("joi");
const decideurService = require("../../services/decideurs/decideur.service");
const logger = require("../../services/logger");



const getAllDecideurs = async (req, res) => {
    const {code, data, serviceError, log} = await decideurService.getAllDecideurs();

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    }else{
        // Invoke error logger
        logger.error(log);
        res.status(code).json(data);
    }
}

const getDecideurById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Invoke service
        const {code, data, serviceError, log} = await decideurService.getDecideurById(id);
        if (!serviceError){
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
            logger.debug(log)
        }else{
            // Invoke error logger
            logger.error(log);
            res.status(code).json(data);
        }
    }catch (e){
        res.json("Number must be provided");
    }
}

const deleteById = async (req, res) => {
    // Delete Decideur by id
    try {
        const id = parseInt(req.params.id);

        // Invoke service
        const {code, data, serviceError, log} = await decideurService.deleteById(id);

        if (!serviceError){
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
            logger.debug(log)
        }else{
            // Invoke error logger
            logger.error(log);
            res.status(code).json(data);
        }

    }catch (e) {
        res.json("Number my be provided");
    }
}

const deleteByEmail = async (req, res) => {
    const validator = Joi.object({
        email: Joi.string().email().required()
    });

    const {error} = validator.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {email} = req.body;
    const {code, data, serviceError, log} = await decideurService.deleteByEmail(email);

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    }else{
        // Invoke error logger
        logger.error(log);
        res.status(code).json(data);
    }
}

module.exports = {
    getAllDecideurs,
    getDecideurById,
    deleteById,
    deleteByEmail
}