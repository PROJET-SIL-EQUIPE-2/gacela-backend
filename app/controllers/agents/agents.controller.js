const Joi = require("joi");
const agentsService = require("../../services/agents/agents.service")

const getAllAgents = async (req, res) => {
    const {code, data, serviceError, log} = await agentsService.getAllAgents()
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
    }
}

const getAgentById = async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        const {code, data, serviceError, log} = await agentsService.getById(id)
        if (!serviceError){
            // Send  message to user
            res.status(code).json(data)
            // Invoke logger
        }else{
            // Invoke error logger
            console.log(serviceError);
            res.status(code).json(serviceError)
        }

    }catch (e) {

    }
}

module.exports = {
    getAllAgents,
    getAgentById
}