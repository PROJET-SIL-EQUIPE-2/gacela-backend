const Joi = require("joi");
const bcrypt = require("bcrypt");
const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();


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
        personal_photo: Joi.string().required(),
        photo_identity: Joi.string().required()
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
        personal_photo,
        photo_identity
    } = req.body;

    try {
        // Check if locataire already exists
        const locataire = await prisma.locataires.findUnique({
            where: {
                email: email
            }
        });
        if (locataire) {
            // User exists
            return res.status(400).json({
                errors: [{
                    msg: "Locataire already exists"
                }]
            });
        }

        // Create a brand new locataire
        const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newLocataire = await prisma.locataires.create({
            data: {
                name: name,
                family_name: family_name,
                email: email,
                phone_number: phone_number,
                password: passwordHash,
                personal_photo: personal_photo,
                photo_identity: photo_identity
            }
        })

        // Add locataire to DemandeInscription table

        // Add locataire to demands table
        await prisma.DemandesInscription.create({
            data: {
                // locataire_id: newLocataire.id,
                locataire_id: newLocataire.id,
                date_demande: new Date().toISOString(),
                etat_demande: DEMAND_STATE_PENDING,
            }
        });

        return res.status(201).json(newLocataire); // TODO: Change this to meet frontend requirements
    } catch (e) {
        console.error(e);
        return res.status(500).send("Server error...");
    }
}


// Validate user demand
const validateLocataire = async (req, res) => {
    const  data = req.body;
    const validationSchema  = Joi.object({
        email: Joi.string().email().required()
    });

    const {error} = validationSchema.validate(data);

    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const {email} = data;

    try {
        // Find locataire
        let locataire = await prisma.locataires.findUnique({
            where: {
                email: email
            }
        });

        if (!locataire){
            return res.status(400).json({
                errors: [{ msg: "Use doesn't exist" }]
            });
        }

        // Change DemandInscription table
        await prisma.DemandesInscription.updateMany({
            where:{
                locataire_id: locataire.id,
            },
            data:{
                etat_demande: DEMAND_STATE_VALIDATED
            }
        });


        // Change Locataire table
        locataire = await prisma.locataires.update({
            where: {
                email: email
            },
            data: {
                validated: true
            }
        });

        return res.status(201).json(locataire); // TODO: Change this to meet frontend requirements

    }catch (e){
        console.error(e);
        return res.status(500).send("Server error...");
    }

}

const rejectLocataire = async (req, res) => {
    const  data = req.body;
    const validationSchema  = Joi.object({
        email: Joi.string().email().required(),
        justificatif: Joi.string().required()
    });

    const {error} = validationSchema.validate(data);

    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }
    const {email, justificatif} = data;

    try {
        // Find locataire
        let locataire = await prisma.locataires.findUnique({
            where: {
                email: email
            }
        });

        if (!locataire){
            return res.status(400).json({
                errors: [{ msg: "Use doesn't exist" }]
            });
        }

        // Change DemandInscription table
        const updatedDemand = await prisma.DemandesInscription.updateMany({
            where:{
                locataire_id: locataire.id,
            },
            data:{
                etat_demande: DEMAND_STATE_REJECTED
            }
        });

       if (!updatedDemand){
           return res.status(404).json({
               err: "Cannot update demand"
           })
       }

       console.log(updatedDemand);

        // Add to DemandesInscriptionRejected
        await prisma.DemandesInscriptionRejected.create({
            data: {
                demande_id: updatedDemand[0].demande_id,
                justificatif: justificatif
            }
        });

        res.json({
            message: "Rejected",
            reason: justificatif
        })

    }catch (e){
        console.error(e);
        return res.status(500).send("Server error...");
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

//  TODO: Implement Sign Up for Agents
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

    try {
        console.log("hi");
        // Check if agent already exits
        const agent = await prisma.AgentsMaintenance.findUnique({
            where: {
                email: email
            }
        });

        if (agent){
            // Agent exists
            return res.status(400).json({
                errors: [{
                    msg: "Agent already exists"
                }]
            });
        }
        // Create a brand new agent
        const salt = await bcrypt.genSalt(process.env.BCRYPT_ROUNDS || 10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAgent = await prisma.AgentsMaintenance.create({
            data: {
                name: name,
                family_name: family_name,
                email: email,
                phone_number: phone_number,
                password: passwordHash,
            }
        })
        console.log(passwordHash);
        return res.status(201).json(newAgent);
    }catch (e){
        console.error(e);
        return res.status(500).send("Server error...");
    }

}


module.exports = {
    signUpLocataire,
    signUpAM,
    validateLocataire,
    rejectLocataire
}