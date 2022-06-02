const paymentsStatsService = require("../../services/stats/paymentsStats.service")
const logger = require("../../services/logger");
const Joi = require("joi");


const yearlyReport = async (req, res) => {

    const validator = Joi.object({
        year: Joi.number().required()
    });

    const {error} = validator.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {year} = req.body
    const {code, data, serviceError, log} = await paymentsStatsService.yearlyReport(year)

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}


const monthlyReport = async (req, res) => {

    const validator = Joi.object({
        year: Joi.number().required(),
        month: Joi.number().required()
    });

    const {error} = validator.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {year, month} = req.body
    const {code, data, serviceError, log} = await paymentsStatsService.monthlyReport(year, month)

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        res.status(code).json(serviceError)
    }
}

const dailyReport = async (req, res) => {

    const validator = Joi.object({
        year: Joi.number().required(),
        month: Joi.number().required(),
        day: Joi.number().required()
    });

    const {error} = validator.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {year, month, day} = req.body
    const {code, data, serviceError, log} = await paymentsStatsService.dailyReport(year, month, day)

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
    yearlyReport,
    monthlyReport,
    dailyReport
}