const router = require("express").Router();
const signUpController = require("../controllers/signup.controller");

router.post("/locataire", signUpController.signUpLocataire);

// router.post("/agent", signUpController.signUpAM);


module.exports = router;