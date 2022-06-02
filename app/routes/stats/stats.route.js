const router = require("express").Router()
const rentalsStatsController = require("../../controllers/stats/rentals.controller")
const paymentStatsController = require("../../controllers/stats/payments.controller")
/**
 * Rate of usage based on number of rentals per region
 * */
router.get("/rental", rentalsStatsController.rental)

router.get("/payment/yearly", paymentStatsController.yearlyReport)

router.get("/payment/monthly", paymentStatsController.monthlyReport)

router.get("/payment/daily", paymentStatsController.dailyReport)


module.exports = router