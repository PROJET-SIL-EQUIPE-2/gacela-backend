const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const locataireSignupValidate = (data) => {
    // Validate locataire schema
    const validationSchema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        family_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().max(255).required(),
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
    const {error} = locataireSignupValidate(req.body);
    if (error){
        // Bad request
        return res.status(400).json({
            errors: [{msg: error.details[0].message}]
        });
    }

    // Extract validated data from body
    const {
        name,
        family_name,
        email,
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
        console.log(locataire);
        if (locataire){
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
                password: passwordHash,
                personal_photo: personal_photo,
                photo_identity: photo_identity
            }
        })
        return res.status(201).json(newLocataire);
    }catch (e) {
        console.error(e);
        return res.status(500).send("Server error...");
    }
}

//  TODO: Implement Sign Up for Agents
const signUpAM = (req, res) => {

}


module.exports = {
    signUpLocataire,
    signUpAM
}