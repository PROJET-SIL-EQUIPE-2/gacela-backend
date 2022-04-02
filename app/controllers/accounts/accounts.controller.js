const Joi = require("joi");
const accountsService = require("../../services/accounts/accounts.service");


const deleteLocataire = async (req, res) => {
    // Validate data

    // Invoke service

    // Send response to client
}

// Delete AM by email
const deleteAM = async (req, res) => {
    // Validate data
    const validator = Joi.object({
        email: Joi.string().email().required()
    });
    const {error} = validator.validate(req.body);

    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const {email} = req.body;

    // Invoke service
    const {code, data, serviceError} = await accountsService.deleteAM(email);

    // Send response to client
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
    deleteLocataire,
    deleteAM
}