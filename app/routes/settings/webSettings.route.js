

const webSettingsController = require("../../controllers/settings/webSettings.controller")
const express = require("express");
const router = express.Router();


// update decideur password
router.put("/decideur/password/:id",webSettingsController.passwordUpdate);


// update decideur email
router.put("/decideur/email/:id", webSettingsController.emailUpdate); 




module.exports = router;