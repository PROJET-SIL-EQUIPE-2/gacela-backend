const joi = require("joi")
// import authController from '../controllers/auth.controller'
const authController = require("../controllers/auth.controller")
// Create express router
const router = require("express").Router();

// Authenticate clients
router.get("/api/auth/locataire/", authController.authStudent)
router.post("/api/auth/web/", authController.authAdmins , authController.authDecideurs)

// export default router;
module.exports = router;
