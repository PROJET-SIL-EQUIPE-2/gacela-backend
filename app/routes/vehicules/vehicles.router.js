const router = require("express").Router();
const vehiclesController = require("../../controllers/vehicules/vehicles.controller");

// Get all vehicles
router.get("/all", vehiclesController.getAllVehicles);

// Vehicle by id
router.get("/:id", vehiclesController.getVehicleById);

// Add new vehicle
router.post("/add", vehiclesController.addVehicle);

// delete vehicle

router.delete("/delete/:id", vehiclesController.deleteVehicle);


module.exports = router;