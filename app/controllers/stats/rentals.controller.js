const rentalsService = require("../../services/stats/rentals.service")
const logger = require("../../services/logger");


const rental = async (req, res) => {
    let region_name = req.query.region
    const {code, data, serviceError, log} = await rentalsService.rental(region_name)
    if (!serviceError) {
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
        logger.debug(log)
    } else {
        // Invoke error logger
        logger.error(log);
        res.status(code).json(data);
    }
}


module.exports = {
    rental
}