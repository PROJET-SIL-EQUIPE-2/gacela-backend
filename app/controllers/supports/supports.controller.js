const supportsService = require("../../services/supports/supports.service")
const Joi = require("joi");




const supportValidate = (data) => {
    const validationSchema = Joi.object({
        typeSupport: Joi.string().required(),
        message: Joi.string().required(),
    });
    return validationSchema.validate(data)
}


// envoie d'une demande de support par un locataire
const demandeSupport = async (req, res) => {

    // Validate user supplied data
    const { error } = supportValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract validated data from body
    const { typeSupport, message } = req.body;
    const { code, data } = await supportsService.demandeSupport(req.params.reservation_id, typeSupport, message)
    return res.status(code).json(data)
}


// get demande de support for AM

const getDemandeSupport = async (req, res) => {
    const { code, data } = await supportsService.getDemandeSupport(req.params.agent_id)
    return res.status(code).json(data)
}

// get demande de support for Admin

const getAllDemandeSupport = async (req, res) => {
    const { code, data } = await supportsService.getAllDemandeSupport()
    return res.status(code).json(data)
}

// read une demande de support par AM

const readDemandeSupport = async (req, res) => {
    const { code, data } = await supportsService.readDemandeSupport(req.params.demande_id)
    return res.status(code).json(data)
}

// repondre a un demande de support

const replyValidate = (data) => {
    const validationSchema = Joi.object({
        locataire_id: Joi.number().required(),
        admin_id: Joi.number().required(),
        message: Joi.string().required(),
    });
    return validationSchema.validate(data)
}

const replyDemandeSupport = async (req, res) => {
    const { error } = replyValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            success: false,
            errors: [{ msg: error.details[0].message }]
        });
    }

    if (!req.params.demande_id)
        return res.status(400).json({
            success: false,
            errors: [{ msg: "demande id est obligatoire" }]
        });

    // Extract validated data from body
    const { locataire_id: locataireId, admin_id: adminId, message } = req.body;
    const demandeId = req.params.demande_id;
    const { code, data } = await supportsService.replyDemandeSupport(
        demandeId, locataireId, adminId, message
    )
    return res.status(code).json(data)
}

const getDemandeSupportReplies = async (req, res) => {
    if (!req.params.demande_id)
        return res.status(400).json({
            success: false,
            errors: [{ msg: "demande id est obligatoire" }]
        });

    const { code, data } = await supportsService.getDemandeSupportReplies(req.params.demande_id)
    return res.status(code).json(data)
}

module.exports = {
    getAllDemandeSupport,
    getDemandeSupport,
    demandeSupport,
    readDemandeSupport,
    replyDemandeSupport,
    getDemandeSupportReplies
}