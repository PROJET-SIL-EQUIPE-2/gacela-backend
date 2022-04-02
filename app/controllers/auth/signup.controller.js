const Joi = require("joi");

const  registrationService = require("../../services/auth/registration.service");



const DEMAND_STATE_VALIDATED = 1;
const DEMAND_STATE_PENDING = 2;
const DEMAND_STATE_REJECTED = 3;


const locataireSignupDataValidate = (data) => {
    // Validate locataire schema
    const validationSchema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        family_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().max(255).required(),
        phone_number: Joi.string().required(),
        password: Joi.string().min(8).max(255).required(),
    });
    return validationSchema.validate(data)
}

/*
* HTTP codes
* 201: Resource created
* */

const signUpLocataire = async (req, res) => {

    // Validate user supplied data
    const { error } = locataireSignupDataValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract validated data from body
    const {
        name,
        family_name,
        email,
        phone_number,
        password,
    } = req.body;

    const {code, data, serviceError} = await registrationService.signUpLocataire(req, name, family_name, email, phone_number, password)
    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
    }
}

// Validate locataire based on there emails
const validateLocataire = async (req, res) => {

    const validationSchema = Joi.object({
        email: Joi.string().email().required()
    });

    const {error} = validationSchema.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const {email} = req.body;
    const {code, data, serviceError} = await registrationService.validateLocataire(email);

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
    }

}

// TODO: Delete records ?
// Reject locataire based on email
const rejectLocataire = async (req, res) => {
    const validationSchema = Joi.object({
        email: Joi.string().email().required(),
        justificatif: Joi.string().required()
    });

    const {error} = validationSchema.validate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const {email, justificatif} = req.body;

    const {code, data, serviceError} = await registrationService.rejectLocataire(email, justificatif);

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
    }

}


const agentSignUpDataValidate = (data) =>  {
    const validationSchema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        family_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().max(255).required(),
        phone_number: Joi.string().required(),
        password: Joi.string().min(8).max(255).required()
    });
    return validationSchema.validate(data);
}


const signUpAM = async (req, res) => {
    // 1. Validate user supplied data
    const {error} = agentSignUpDataValidate(req.body);
    if (error){
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    // 2. Extract validated data from body
    const {
        name,
        family_name,
        email,
        phone_number,
        password
    } = req.body;
    const {code, data, serviceError} = await registrationService.signUpAM(name, family_name, email, phone_number, password)

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
    }

}

const registerAdmin = async (req, res) => {
    // 1. Validate user supplied data
    const validationSchema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        family_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().max(255).required(),
        password: Joi.string().min(8).max(255).required()
    });
    const {error} = validationSchema.validate(req.body);
    if (error){
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    // 2. Extract validated data from body
    const {
        name,
        family_name,
        email,
        password
    } = req.body;

    const {code, data, serviceError} = await registrationService.registerAdmin(name, family_name, email, password);

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
    }
}

const registerDicedeur = async (req, res) => {
    // 1. Validate user supplied data
    const {error} = agentSignUpDataValidate(req.body);
    if (error){
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    // 2. Extract validated data from body
    const {
        name,
        family_name,
        email,
        phone_number,
        password
    } = req.body;

    const {code, data, serviceError} = await registrationService.registerDecideur(name, family_name, email, phone_number, password);

    if (!serviceError){
        // Send  message to user
        res.status(code).json(data)
        // Invoke logger
    }else{
        // Invoke error logger
    }
}


module.exports = {
    signUpLocataire,
    signUpAM,
    validateLocataire,
    rejectLocataire,
    registerAdmin,
    registerDicedeur
}