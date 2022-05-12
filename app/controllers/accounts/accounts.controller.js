const Joi = require("joi");
const accountsService = require("../../services/accounts/accounts.service");
const logger = require("../../services/logger");


const deleteLocataire = async (req, res) => {
    // Validate data
    const validator = Joi.object({
        email: Joi.string().email().required()
    });

    const {error} = validator.validate(req.body);

    if (error) {
        // Bad request
        logger.error(`Error ${error.details[0].message} occurred when trying to delete locataire`)
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const {email} = req.body;

    // Invoke service
    const {code, data, serviceError, log} = await accountsService.deleteLocataire(email);

    // Send response to client
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

// Delete AM by email
const deleteAM = async (req, res) => {
    // Validate data
    const validator = Joi.object({
        email: Joi.string().email().required()
    });
    const {error} = validator.validate(req.body);

    if (error) {
        // Bad request
        logger.error(`Error ${error.details[0].message} occurred when trying to delete AM`)
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const {email} = req.body;

    // Invoke service
    const {code, data, serviceError, log} = await accountsService.deleteAM(email);

    // Send response to client
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
    deleteLocataire,
    deleteAM
}