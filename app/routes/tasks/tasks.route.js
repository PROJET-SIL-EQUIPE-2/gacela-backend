const tasksController = require("../../controllers/tasks/tasks.controller");
const express = require("express");
const router = express.Router();

// get all tasks
router.get("/:id_agent",tasksController.getAllTasks);


// get completed tasks
router.get("/completed/:id_agent", tasksController.getCompletedTasks); 

// get unfinished tasks 
router.get("/unfinished/:id_agent", tasksController.getUnfinishedTasks);


// get tasks details
router.get("/details/:id_panne", tasksController.getTaskDetail); 

// fix panne
router.put("/:id_task", tasksController.fixPanne)

module.exports = router;