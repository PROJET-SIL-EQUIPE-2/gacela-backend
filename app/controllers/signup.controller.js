const Joi = require("joi");
const bcrypt = require("bcrypt");
const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

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
        return res.status(201).json(newLocataire);
    } catch (e) {
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

    }

}


module.exports = {
    signUpLocataire,
    signUpAM
}