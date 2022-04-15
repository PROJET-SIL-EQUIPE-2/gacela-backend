const tasksService = require("../../services/tasks/tasks.service")





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

module.exports = {
    getAllTasks,
    getCompletedTasks,
    getUnfinishedTasks,
    getTaskDetail,
    fixPanne
}