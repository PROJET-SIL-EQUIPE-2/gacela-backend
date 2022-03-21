const passwordResetController = require("../controllers/passwordReset.controller")
const express = require("express");
const router = express.Router();


// demand reset from locataire
router.post("/locataire",passwordResetController.passwordResetDemandLocataire);


// reset for locataire
 router.patch("/locataire/:userId/:token", passwordResetController.passwordResetLocataire); 

// demand reset from AM
router.post("/agent",passwordResetController.passwordResetDemandAM);

// reset for AM
 router.patch("/agent/:userId/:token", passwordResetController.passwordResetAM); 

module.exports = router;