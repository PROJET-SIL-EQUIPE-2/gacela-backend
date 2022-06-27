const Joi = require("joi")
const paymentService = require("../../services/payment/payment.service")
const refundService = require("../../services/payment/refund.service")
const estimationService = require("../../services/payment/estimation.service")
const fetch = require("node-fetch");
const logger = require("../../services/logger")

const checkout = async (req, res) => {
    const validator = Joi.object({
        reservation_id : Joi.number().required(),
        amount: Joi.number().required()
    })
    const {error} = validator.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {reservation_id, amount} = req.body
    const {code, data, serviceError, log} = await paymentService.createPayment(parseInt(reservation_id), parseFloat(amount))

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
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
        logger.error(log)

    }
}


const estimate = async (req, res) => {
    const {
        departLat,
        departLong,
        destLat,
        destLong
    } = req.body
    const est = await estimationService.getDuration(departLat, departLong, destLat, destLong)
    return res.json(est)
}

const getRefundablePayments = async () => {

}

const generatePaymentReport = () => {

}

const generateRefundReport = () => {

}

module.exports = {
    checkout,
    refund,
    getRefundablePayments,
    estimate
}