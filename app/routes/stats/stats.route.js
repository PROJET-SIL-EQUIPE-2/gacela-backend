const router = require("express").Router()
const statsController = require("../../controllers/stats/stats.controller")

/**
 * Rate of usage based on number of rentals per region
 * */
router.get("/rental", statsController.rental)



module.exports = router