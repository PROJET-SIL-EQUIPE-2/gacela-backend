const router = require("express").Router();
const vehiclesController = require("../../controllers/vehicules/vehicles.controller");

// Get all vehicles
router.get("/all", vehiclesController.getAllVehicles);

// Vehicle by id
router.get("/vehicle/:id", );

// Add new vehicle
router.post("/add", vehiclesController.addVehicle);

// delete vehicle

router.delete("/delete")


module.exports = router;