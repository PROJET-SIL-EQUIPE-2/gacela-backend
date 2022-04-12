const router = require("express").Router();
const blockController = require("../../controllers/blockAccounts/block.controller");

const auth = require("../../middlewares/auth/authorize");
const Role = require("../../middlewares/auth/roles");

router.patch("/locataire", blockController.toggleBlockLocataire);

router.patch("/agent",  blockController.toggleBlockAM);

router.patch("/admin",  blockController.toggleBlockAdmin);

router.patch("/decideur",  blockController.toggleBlockDecideur);


module.exports = router
