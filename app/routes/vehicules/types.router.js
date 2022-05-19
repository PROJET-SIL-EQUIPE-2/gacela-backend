const router = require("express").Router();
const typesController = require("../../controllers/vehicules/types.controller")

router.get("/", typesController.getAllTypes);

router.get("/:type", typesController.getType);

router.post("/", typesController.addType);

module.exports = router