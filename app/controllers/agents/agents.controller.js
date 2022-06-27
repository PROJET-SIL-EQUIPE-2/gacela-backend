const Joi = require("joi");
const agentsService = require("../../services/agents/agents.service")
const logger = require("../../services/logger");

const getAllAgents = async (req, res) => {
    const {code, data, serviceError, log} = await agentsService.getAllAgents()
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

const getAgentById = async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        const {code, data, serviceError, log} = await agentsService.getById(id)
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

    }catch (e) {
        logger.error(e.meta);

    }
}

module.exports = {
    getAllAgents,
    getAgentById
}