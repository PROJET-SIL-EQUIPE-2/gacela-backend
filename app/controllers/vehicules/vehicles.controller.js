const Joi = require("joi")
const vehiclesService = require("../../services/vehicules/vehicles.service");



const getAllVehicles = async (req, res) => {
    // Invoke service
    const {code, data, serviceError} = await vehiclesService.getAll();

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
    }
}

const getVehicleById = (req, res) => {

}

const addVehicle = async (req, res) => {
    const validator = Joi.object({
        type: Joi.string().required(),
        mileage: Joi.number().required(),
        price_per_hour: Joi.number().required()
    })
    const {error} = validator.validate(req.body);

    // Extract data
    const {
        type,
        mileage,
        price_per_hour
    } = req.body;

    // Invoke service
    const {code, data, serviceError} = await vehiclesService.addVehicle(type, parseFloat(mileage), parseFloat(price_per_hour));

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
        console.log(serviceError);
        res.status(code).json(serviceError)
    }
}

const deleteVehicle = (req, res) => {

}

module.exports = {
    getAllVehicles,
    getVehicleById,
    addVehicle,
    deleteVehicle
}