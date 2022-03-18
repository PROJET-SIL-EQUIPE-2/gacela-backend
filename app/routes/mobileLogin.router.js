const router = require("express").Router();
const mobileLoginController = require("../controllers/mobileLogin.controller.js");

router.post("/locataire", mobileLoginController.loginLocataire);
router.post("/agent", mobileLoginController.loginAM);

module.exports = router;
