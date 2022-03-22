const router = require("express").Router();
const locataireController = require('../controllers/locataireController');


// Get validated locataire
router.get("/validated", locataireController.getValidatedLocataires);

// Get non-validated locataires
router.get("/non_validated", locataireController.getNonValidatedLocataires);



module.exports = router;