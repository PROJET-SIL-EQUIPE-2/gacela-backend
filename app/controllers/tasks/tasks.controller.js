const tasksService = require("../../services/tasks/tasks.service")
const Joi = require("joi")
const logger = require("../../services/logger");




// create task
const createTask = async (req, res) => {
    const validator = Joi.object({
        agent_id: Joi.number().required(),
        description: Joi.string().required(),
        important: Joi.boolean().optional()
    })
    const { error } = validator.validate(req.body);
    if (error) {

        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {agent_id, description, important} = req.body
    const {code, data, serviceError, log} = await tasksService.createTask(agent_id, description, important)
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

// get all tasks

const getAllTasks = async(req, res) => {
    const { code, data } = await tasksService.getAllTasks(req.params.id_agent)
    return res.status(code).json(data)
}

// get completed tasks

const getCompletedTasks = async(req, res) => {
    const { code, data } = await tasksService.getCompletedTasks(req.params.id_agent)
    return res.status(code).json(data)
}

// get unfinished tasks 

const getUnfinishedTasks = async(req, res) => {
    const { code, data } = await tasksService.getUnfinishedTasks(req.params.id_agent)
    return res.status(code).json(data)
}

// get tasks details

const getTaskDetail = async(req, res) => {
    const { code, data } = await tasksService.getTaskDetail(req.params.id_panne)
    return res.status(code).json(data)
}


// fix panne

const fixPanne = async(req, res) => {
    const { code, data } = await tasksService.fixPanne(req.params.id_task)
    return res.status(code).json(data)
}


// update progress 
const updateProgress = async(req, res) => {
    const { code, data } = await tasksService.updateProgress(req.params.id_task)
    return res.status(code).json(data)
}
module.exports = {
    createTask,
    getAllTasks,
    getCompletedTasks,
    getUnfinishedTasks,
    getTaskDetail,
    fixPanne,
    updateProgress
}