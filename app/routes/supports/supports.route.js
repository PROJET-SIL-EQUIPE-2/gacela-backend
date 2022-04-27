const supportsController = require("../../controllers/supports/supports.controller");
const express = require("express");
const router = express.Router();


// reply a une demande
router.post("/reply/:demande_id", supportsController.replyDemandeSupport)

// envoie d'une demande de support par un locataire
router.post("/:reservation_id", supportsController.demandeSupport);


// get demande de support for AM
router.get("/:agent_id", supportsController.getDemandeSupport);

// get demande de support for Admin
router.get("/", supportsController.getAllDemandeSupport);

// read une demande de support par AM
router.put("/:demande_id", supportsController.readDemandeSupport);

// get demande replies
router.get("/reply/:demande_id", supportsController.getDemandeSupportReplies)

module.exports = router;