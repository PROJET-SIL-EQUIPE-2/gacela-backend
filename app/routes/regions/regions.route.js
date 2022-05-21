const router = require("express").Router()
const regionsController = require("../../controllers/regions/regions.controller")

/**
 * GET all regions
 * */
router.get("/", regionsController.getAll)

/**
 * POST add a new region
 * */

router.post("/", regionsController.addRegion)

/**
 * DELETE a region
 * */

router.delete("/:id", regionsController.deleteRegion)

module.exports = router