const router = require("express").Router();
const locataireController = require('../controllers/locataireController');


// Get validated locataire
router.get("/locataire/validated", locataireController.getValidatedLocataires);

// Get non-validated locataires
router.get("/locataire/non_validated", locataireController.getNonValidatedLocataires);



module.exports = router;