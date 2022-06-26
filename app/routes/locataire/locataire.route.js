const router = require("express").Router();
const locataireController = require("../../controllers/locataire/locataireController");

// Get validated locataire
router.get("/validated", locataireController.getValidatedLocataires);

// Get waiting locataires
router.get("/waiting", locataireController.getWaitingLocataires);

// Get rejected
router.get("/validated", locataireController.getValidatedLocataires);
// validate locataire
router.get("/validateLoc", locataireController.Demandevalidate);
//reject locataire

router.get("/rejected", locataireController.getRejectedLocataires);

router.get("/blocked", locataireController.getBlockedLocataires);

router.get("/not-blocked", locataireController.getNotBlockedLocataires);
router.get("/all", locataireController.getAllLocataires);

module.exports = router;
