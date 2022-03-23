const passwordResetController = require("../../controllers/auth/passwordResetWeb.controller")

const express = require("express");
const router = express.Router();

 
router.post("/admin",passwordResetController.passwordResetDemandAdmin);


 router.patch("/admin/:a/:userId/:token", passwordResetController.passwordResetAdmin); 

 /* router.post("/decideur",passwordResetController.passwordResetDemandDecideur);


 router.patch("/decideur/:userId/:token", passwordResetController.passwordResetDecideur); 
 */
module.exports = router;