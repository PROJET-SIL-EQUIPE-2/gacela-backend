const router = require("express").Router();
const signUpController = require("../controllers/signup.controller");

// register new locataire route
router.post("/locataire", signUpController.signUpLocataire);

// validate locataire demand by email
router.post("/locataire/validate", signUpController.validateLocataire);

// reject locataire and send him
router.post("/locataire/reject", signUpController.rejectLocataire);


// Register new agent route
router.post("/agent", signUpController.signUpAM);

// Register new admin
// router.post("/admin", signUpController.registerAdmin);

module.exports = router;