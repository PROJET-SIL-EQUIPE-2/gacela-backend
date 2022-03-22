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
        await prisma.DemandesInscription.create({
            data: {
                locataire_id: newLocataire.id,
                date_demande: new Date().toISOString(),
                etat_demande: DEMAND_STATE_PENDING
            }
        });

        return res.status(201).json(newLocataire);
    } catch (e) {
        console.error(e);
        return res.status(500).send("Server error...");
    }
}

// Validate locataire based on there emails
const validateLocataire = async (req, res) => {
    const data = req.body;
    const validationSchema = Joi.object({
        email: Joi.string().email().required()
    });

    const {error} = validationSchema.validate(data);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    const {email} = req.body;

    try {
        // Find locataire demand
        const locataire = await prisma.locataires.findUnique({
            where: {
                email: email
            }
        });

        // Check if locataire doesn't exist
        if (!locataire) {
            return res.status(400).json({
                errors: [{
                    msg: "Locataire doesn't exists"
                }]
            });
        }
        // Check if locataire demand is validated
        if (locataire.validated){
            return res.status(400).json({
                errors: [{
                    msg: "Locataire is already validated"
                }]
            });
        }

        // Find demand
        let demand = await prisma.DemandesInscription.findMany({
            where: {
                locataire_id:locataire.id
            },
            include:{
                EtatDemandeInscription: true
            }
        });
        // res.json(demand);
        console.log(demand);
        if (demand.length > 0){
            let demandRejected = await prisma.DemandesInscriptionRejected.findUnique({
                where: {
                    demande_id: demand[0].demande_id
                }
            })
            if (!demandRejected){
                // Locataire is not rejected before

                // Create a transaction that does the following
                // 1. Update DemandesInscription
                // 2. Update validated column

                const [updatedDemand, updatedLocataire] = await prisma.$transaction([
                    prisma.DemandesInscription.update({
                        where: {
                            demande_id: demand[0].demande_id
                        },
                        data: {
                            etat_demande: DEMAND_STATE_VALIDATED
                        }
                    }),
                    prisma.locataires.update({
                        where: {
                            id: locataire.id
                        },
                        data: {
                            validated: true
                        },
                        select: {
                            id: true,
                            email: true,
                            phone_number: true,
                            photo_identity: true,
                            personal_photo: true,
                            name: true,
                            family_name: true,
                            validated: true
                        }
                    })
                ]);

                return res.send(updatedLocataire);

            }
            // TODO: Should we handle the case where locataire was rejected before
            return res.send("this demand was rejected before");
        }
        return res.send("No demand");
    }catch (e){
        console.error(e);
        return res.json(e);
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
    // rejectLocataire
}