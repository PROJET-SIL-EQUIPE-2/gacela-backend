const Joi = require("joi");
const blockAccountsService = require("../../services/blockAccounts.service");
const accountsService = require("../../services/blockAccounts.service");
const logger = require("../../services/logger");

const toggleBlockAdmin=async (req, res, next) => {
    // Validate data
    const validator = Joi.object({
        email: Joi.string().email().required(),
    });
    const {error} = validator.validate(req.body);

    if (error) {
        // Bad request
        logger.error(error.details[0].message)
        return res.status(400).json({
            errors: [{msg: error.details[0].message}]
        });
    }

    const {email , accountType} = req.body;

    // Invoke service
    const {code, data, serviceError} = await accountsService.toggleBlock(email , "ADMIN" );
    console.log("CODE =", code);
    console.log("DATA =", data);
    console.log("SERVICE ERROR =", serviceError);
    // Send response to client
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

const toggleBlockAM=async (req, res, next) => {
    // Validate data
    const validator = Joi.object({
        email: Joi.string().email().required(),
    });
    const {error} = validator.validate(req.body);

    if (error) {
        // Bad request
        logger.error(error.details[0].message)
        return res.status(400).json({
            errors: [{msg: error.details[0].message}]
        });
    }

    const {email , accountType} = req.body;

    // Invoke service
    const {code, data, serviceError} = await accountsService.toggleBlock(email , "AM" );
    console.log("CODE =", code);
    console.log("DATA =", data);
    console.log("SERVICE ERROR =", serviceError);
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

const toggleBlockDecideur=async (req, res, next) => {
    // Validate data
    const validator = Joi.object({
        email: Joi.string().email().required(),
    });
    const {error} = validator.validate(req.body);

    if (error) {
        // Bad request
        logger.error(error.details[0].message)
        return res.status(400).json({
            errors: [{msg: error.details[0].message}]
        });
    }

    const {email , accountType} = req.body;

    // Invoke service
    const {code, data, serviceError} = await accountsService.toggleBlock(email , "DECIDEUR" );

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


const toggleBlockLocataire=async (req, res, next) => {
    // Validate data
    const validator = Joi.object({
        email: Joi.string().email().required(),
    });
    const {error} = validator.validate(req.body);

    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{msg: error.details[0].message}]
        });
    }

    const {email , accountType} = req.body;

    // Invoke service
    const {code, data, serviceError} = await accountsService.toggleBlock(email , "LOCATAIRE" );

    // Send response to client
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    } else {
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}

module.exports={
    toggleBlockDecideur,
    toggleBlockLocataire,
    toggleBlockAdmin,
    toggleBlockAM
}
