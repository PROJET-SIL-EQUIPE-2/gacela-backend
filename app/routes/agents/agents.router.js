const router = require("express").Router();
const agentsController = require("../../controllers/agents/agents.controller");
const Roles = require("../../middlewares/auth/roles");
const auth = require("../../middlewares/auth/authorize");

// Get all
router.get("/all", agentsController.getAllAgents);

// Get by id
router.get("/:id", agentsController.getAgentById);

module.exports = router;
