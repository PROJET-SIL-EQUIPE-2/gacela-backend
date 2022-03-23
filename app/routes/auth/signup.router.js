const router = require("express").Router();
const signUpController = require("../../controllers/auth/signup.controller");

const multer  = require('multer')
const uploader = multer({ dest: 'uploads/' })

// register new locataire route
router.post("/locataire", uploader.fields([
        { name: 'personal_photo', maxCount: 1 },
        { name: 'photo_identity', maxCount: 1 }
    ]
), signUpController.signUpLocataire);


// validate locataire demand by email
router.post("/locataire/validate", signUpController.validateLocataire);

// reject locataire and send him a justification
router.post("/locataire/reject", signUpController.rejectLocataire);


// Register a new agent route
router.post("/agent", signUpController.signUpAM);

// Register new admin
router.post("/admin", signUpController.registerAdmin);

// Register a new dicedeur
router.post("/decideur", signUpController.registerDicedeur);

module.exports = router;