const passwordResetController = require("../../controllers/auth/passwordResetWeb.controller")
const passwordResetService = require('../../services/passwordReset.service')

const express = require("express");
const router = express.Router();

 
router.post("/admin",passwordResetController.resetPasswordRequestController);


 router.patch("/admin/:userId/:token", passwordResetController.resetPasswordController); 
 /*


router.post("/admin",passwordResetService.requestPasswordResetAdmin);


 router.patch("/admin/:userId/:token", passwordResetService.passwordResetAdmin); 
*/
module.exports = router;