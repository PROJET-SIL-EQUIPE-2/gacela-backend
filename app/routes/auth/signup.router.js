const router = require("express").Router();
const signUpController = require("../../controllers/auth/signup.controller");
const auth = require("../../middlewares/auth/authorize");
const Role = require("../../middlewares/auth/roles");

const multer  = require('multer')
const uploader = multer({ dest: 'uploads/' })

// register new locataire route
router.post("/locataire", uploader.fields([
        { name: 'personal_photo', maxCount: 1 },
        { name: 'photo_identity', maxCount: 1 }
    ]
), signUpController.signUpLocataire);


// validate locataire demand by email
router.post("/locataire/validate", auth.authorize(Role.Admin), signUpController.validateLocataire);

// reject locataire and send him a justification
router.post("/locataire/reject", auth.authorize(Role.Admin), signUpController.rejectLocataire);


// Register a new agent route
router.post("/agent", signUpController.signUpAM);

// Register new admin
router.post("/admin", signUpController.registerAdmin);

// Register a new dicedeur
router.post("/decideur", signUpController.registerDicedeur);

module.exports = router;