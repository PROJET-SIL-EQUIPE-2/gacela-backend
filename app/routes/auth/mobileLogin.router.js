const router = require("express").Router();
const mobileLoginController = require("../../controllers/auth/mobileLogin.controller.js");

router.post("/locataire", mobileLoginController.loginLocataire);
router.post("/agent", mobileLoginController.loginAM);

module.exports = router;
