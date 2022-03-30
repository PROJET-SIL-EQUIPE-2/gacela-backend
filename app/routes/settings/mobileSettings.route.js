const mobileSettingsController = require("../../controllers/settings/mobileSettings.controller")
const express = require("express");
const router = express.Router();


// update locataire password
router.put("/locataire/password/:id",mobileSettingsController.passwordUpdateLocataire);


// update locataire email
router.put("/locataire/email/:id", mobileSettingsController.emailUpdateLocataire); 

// update am password
router.put("/agent/password/:id",mobileSettingsController.passwordUpdateAM);


// update am email
router.put("/agent/email/:id", mobileSettingsController.emailUpdateAM); 


module.exports = router;