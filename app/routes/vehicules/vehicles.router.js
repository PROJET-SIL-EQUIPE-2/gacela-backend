const router = require("express").Router();
const vehiclesController = require("../../controllers/vehicules/vehicles.controller");

const multer  = require('multer')
const path = require("path");
const uploadPath = "images/vehicles/";
const uploader = multer({ dest: path.join("uploads", uploadPath) })

// Get all vehicles
router.get("/all", vehiclesController.getAllVehicles);

// Vehicle by id
router.get("/:id", vehiclesController.getVehicleById);

// Get all vehicules with detailed response

// Get available vehicules
router.get("/all/available", vehiclesController.getAvailable)

// Get reserved vehicules
router.get("/all/reserved", vehiclesController.getReserved)

// Get out of order vehicules
router.get("/all/defective", vehiclesController.getDefective)

// Add new vehicle
router.post("/add", uploader.single('car_photo'), vehiclesController.addVehicle);


// assign to agent
router.post("/assign", vehiclesController.assign);

// unassign agent
router.post("/unassign", vehiclesController.unassign)

// delete vehicle

router.delete("/delete/:id", vehiclesController.deleteVehicle);


module.exports = router;