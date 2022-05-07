const router = require("express").Router()
const paymentController = require("../../controllers/payment/payment.controller")
/*
* Estimates reservation charges
* */
router.get("/estimate")


/*
* Makes the real checkout
* */
router.post("/checkout", paymentController.checkout)


/*
* Makes a refund to a client
* */
router.post("/refund", paymentController.refund)


/*
* Cancels a payment
* NOTE: To be discussed
* */
router.post("/cancel")


module.exports = router