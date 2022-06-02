const Joi = require("joi")
const regionsService = require("../../services/regions/regions.service")
const logger = require("../../services/logger");

const getAll = async (req, res) => {
    let name = req.query.name
    const {code, data, serviceError, log} = await regionsService.getAllRegions(name)
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger#
        logger.debug(log)
    }else{
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
        logger.error(log)
    }
}


const addRegion = async (req, res) => {
    const validator = Joi.object({
        name: Joi.string().required()
    })
    const { error } = validator.validate(req.body);
    if (error) {

        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract data
    const {
        name
    } = req.body;

    // Invoke service
    const { code, data, serviceError, log } = await regionsService.addRegion(name);

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


const deleteRegion = async (req, res) => {
    try {
        let id = parseInt(req.params.id)
        // Invoke service
        const { code, data, serviceError, log } = await regionsService.deleteRegion(id);

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
    }catch (e){
        return res.status(500).json("Id must be an integer type")
    }
}


module.exports = {
    getAll,
    addRegion,
    deleteRegion
}