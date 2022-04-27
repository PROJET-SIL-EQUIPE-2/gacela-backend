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
const demandeSupport = async (req,res) => {
   
    // Validate user supplied data
const { error } = supportValidate(req.body);
if (error) {
  // Bad request
  return res.status(400).json({
      errors: [{ msg: error.details[0].message }]
  });
  }

      // Extract validated data from body
      const {typeSupport, message} = req.body;
      const { code, data } = await supportsService.demandeSupport(req.params.reservation_id,typeSupport,message)
      return res.status(code).json(data)
      }


// get demande de support for AM

const getDemandeSupport = async(req, res) => {
    const { code, data } = await supportsService.getDemandeSupport(req.params.agent_id)
    return res.status(code).json(data)
}

// get demande de support for Admin

const getAllDemandeSupport = async(req, res) => {
    const { code, data } = await supportsService.getAllDemandeSupport()
    return res.status(code).json(data)
}

// read une demande de support par AM

const readDemandeSupport = async(req, res) => {
    const { code, data } = await supportsService.readDemandeSupport(req.params.demande_id)
    return res.status(code).json(data)
}

module.exports = {
    getAllDemandeSupport,
    getDemandeSupport,
    demandeSupport,
    readDemandeSupport
}