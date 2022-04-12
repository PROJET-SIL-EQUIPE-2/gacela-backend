
const Joi = require("joi");
const passwordResetService = require("../../services/auth/passwordReset.service")



const emailValidate = (data) => {
    // Validate email
    const validationSchema = Joi.object({
        email: Joi.string().email().required()
    });
    return validationSchema.validate(data)
}

const passwordValidate = (data) => {
    // Validate password
    const validationSchema = Joi.object({
        password: Joi.string().min(8).max(255).required(),
    });
    return validationSchema.validate(data)
}

// RESET PASSWORD FOR LOCATAIRE
const passwordResetDemandLocataire = async(req, res) => {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send({
            message :error.details[0].message,
            success : false
        });
   
        // Extract validated data from body
    const email = req.body.email;
    const { code, data } = await passwordResetService.passwordResetDemandLocataire(email)
    return res.status(code).json(data)
}


const passwordResetLocataire = async(req, res) => {
      
        // Validate user suplied password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send({
            message : error.details[0].message,
        success : false});
        
        // Verify if Locataire exists
        const id = req.params.userId;
        const atoken = req.params.token;
        const password = req.body.password;
    const { code, data } = await passwordResetService.passwordResetLocataire(id, atoken, password)
    return res.status(code).json(data)
       
}



// RESET PASSWORD FOR AM
const passwordResetDemandAM = async(req, res) => {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send({
            message : error.details[0].message,
        success : false});
       
        const email = req.body.email;
    const { code, data } = await passwordResetService.passwordResetDemandAM(email)
    return res.status(code).json(data)

}


const passwordResetAM = async(req, res) => {

      
        // Validate user suplied password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send({ message :error.details[0].message,
        success : false});
        
        // Verify if Locataire exists
        const id = req.params.userId;
        const atoken = req.params.token;
        const password = req.body.password;
    const { code, data } = await passwordResetService.passwordResetAM(id, atoken, password)
    return res.status(code).json(data)
       
}
module.exports = {
    passwordResetDemandLocataire,
    passwordResetLocataire,
    passwordResetDemandAM,
    passwordResetAM
}