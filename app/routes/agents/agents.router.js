const router = require("express").Router();
const agentsController = require("../../controllers/agents/agents.controller");
const Roles = require("../../middlewares/auth/roles")
const auth = require("../../middlewares/auth/authorize");

// Get all
router.get("/all", auth.authorize([Roles.Admin, Roles.Decideur]), agentsController.getAllAgents);

// Get by id
router.get("/:id", auth.authorize([Roles.Admin, Roles.Decideur]), agentsController.getAgentById);


module.exports = router