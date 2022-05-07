const Joi = require("joi")
const paymentService = require("../../services/payment/payment.service")
const refundService = require("../../services/payment/refund.service")

const checkout = async (req, res) => {

}

/**
 * Takes a reservation id and performs a refund
 * */
const refund = async (req, res) => {
    const validator = Joi.object({
        reservation_id : Joi.number().required()
    })
    const {error} = validator.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {reservation_id} = req.body
    const {code, data, serviceError, log} = await refundService.refund(parseInt(reservation_id))

    // Send response to client
    console.log(data)
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}


module.exports = {
    checkout,
    refund
}