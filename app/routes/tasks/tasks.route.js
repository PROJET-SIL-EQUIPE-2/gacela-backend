const tasksController = require("../../controllers/tasks/tasks.controller");
const express = require("express");
const router = express.Router();

// Create task
router.post("/create", tasksController.createTask);

// get all tasks
router.get("/:id_agent", tasksController.getAllTasks);


// get completed tasks
router.get("/completed/:id_agent", tasksController.getCompletedTasks);

// get unfinished tasks 
router.get("/unfinished/:id_agent", tasksController.getUnfinishedTasks);


// get tasks details
router.get("/details/:id_panne", tasksController.getTaskDetail);

// fix panne
router.put("/:id_task", tasksController.fixPanne)

// update progress
router.put("/progress/:id_task", tasksController.updateProgress)

module.exports = router;