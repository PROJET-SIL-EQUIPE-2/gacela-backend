const joi = require("joi")
// import authController from '../controllers/auth.controller'
const authController = require("../controllers/auth.controller")
// Create express router
const router = require("express").Router();

// Authenticate clients
router.get("/locataire/", authController.authLocataire)

// export default router;
module.exports = router;