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

// Add new vehicle
router.post("/add", uploader.single('car_photo'), vehiclesController.addVehicle);


// assign to agent
router.post("/assign", vehiclesController.assign);


// delete vehicle

router.delete("/delete/:id", vehiclesController.deleteVehicle);


module.exports = router;