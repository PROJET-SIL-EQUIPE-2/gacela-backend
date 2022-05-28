const router = require("express").Router()
const rentalsStatsController = require("../../controllers/stats/rentals.controller")
/**
 * Rate of usage based on number of rentals per region
 * */
router.get("/rental", rentalsStatsController.rental)



module.exports = router