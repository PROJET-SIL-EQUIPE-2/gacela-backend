const router = require("express").Router()

/*
* Estimates reservation charges
* */
router.get("/estimate")


/*
* Makes the real checkout
* */
router.post("/checkout")


/*
* Makes a refund to a client
* */
router.post("/refund")


/*
* Cancels a payment
* NOTE: To be discussed
* */
router.post("/cancel")