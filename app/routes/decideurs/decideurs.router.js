const router = require("express").Router();
const decideurController = require("../../controllers/decideurs/decideur.controller");

// Get all decideurs
router.get("/all", decideurController.getAllDecideurs);

// Get decideur by id
router.get("/:id", decideurController.getDecideurById);

// delete decideur by id
router.delete("/delete/:id", decideurController.deleteById);


// delete decideur by email
router.delete("/delete", decideurController.deleteByEmail);

module.exports = router;