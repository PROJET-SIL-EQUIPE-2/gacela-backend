
const Joi = require("joi");
const webSettingsService = require("../../services/settings/webSettings.service")



    const passwordValidate = (data) => {
        // Validate password
        const validationSchema = Joi.object({
            oldPassword: Joi.string().min(8).max(255).required(),
            newPassword: Joi.string().min(8).max(255).required(),
        });
        return validationSchema.validate(data)
    }


    const emailValidate = (data) => {
        // Validate email
        const validationSchema = Joi.object({
            email: Joi.string().email().required()
        });
        return validationSchema.validate(data)
    }

// UPDATE PASSWORD FOR DECIDEUR

    const passwordUpdate = async(req, res) => {
    // Validate user supplied data
    const { error } = passwordValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract validated data from body
    const {oldPassword, newPassword} = req.body;

    const { code, data } = await webSettingsService.passwordUpdate(req.params.id,oldPassword,newPassword)
    return res.status(code).json(data)
}



// UPDATE EMAIL DECIDEUR

    const emailUpdate = async (req,res) => {
          // Validate user supplied data
    const { error } = emailValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
        }

            // Extract validated data from body
             const newEmail = req.body.email;
             const { code, data } = await webSettingsService.emailUpdate(req.params.id,newEmail)
             return res.status(code).json(data)

    }


    module.exports = {
        passwordUpdate,
        emailUpdate
    }