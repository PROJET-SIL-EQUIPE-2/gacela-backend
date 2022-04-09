const router = require("express").Router();
const accountsController = require("../../controllers/accounts/accounts.controller");

const auth = require("../../middlewares/auth/authorize");
const Role = require("../../middlewares/auth/roles");

router.delete("/locataire", accountsController.deleteLocataire);

router.delete("/agent", auth.authorize([Role.Admin, Role.Decideur]), accountsController.deleteAM);


module.exports = router