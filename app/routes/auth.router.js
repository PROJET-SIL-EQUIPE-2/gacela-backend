const authController = require("../controllers/auth.controller")
// Create express router
const router = require("express").Router();

// Authenticate clients
router.post("/api/auth/web/", authController.authAdmins , authController.authDecideurs)

// export default router;
module.exports = router;
