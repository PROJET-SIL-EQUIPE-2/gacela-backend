const router = require("express").Router();
const locataireController = require('../../controllers/locataire/locataireController');


// Get validated locataire
router.get("/validated", locataireController.getValidatedLocataires);

// Get waiting locataires
router.get("/waiting", locataireController.getWaitingLocataires);

// Get rejected
router.get("/rejected", locataireController.getRejectedLocataires)

module.exports = router;