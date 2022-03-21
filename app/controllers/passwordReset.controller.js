const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail(old)");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



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
    try {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        
        // Check if Locataire exists
        const locataire = await prisma.Locataires.findFirst({
            where : {
                email : req.body.email 
            } });
        
        if (!locataire)
            return res.status(400).send("user with given email doesn't exist");
        
        // Create token
        

        let token = await prisma.Token.findFirst({ 
            where : {
            email: locataire.email 
        }});
        if (!token) {
            token = await prisma.Token.create({
                data : {
                user_id: locataire.id,
                email: locataire.email,
                token: jwt.sign({user_id : locataire.id}, crypto.randomBytes(32).toString("hex"))
                }
            });
        }
        // Create template for email content
        const html = `
        <!DOCTYPE html>
        <html>
            <body>
                <h2>Click here to reset your password</h2>
                <a href="${process.env.BASE_URL}/mobile_passwordReset/locataire/${locataire.id}/${token.token}">Reset here</a>
            </body>
        </html>
                           `;
       const link = `you can reset your password by following this link ${process.env.BASE_URL}/forgot-password/${locataire.id}/${token.token}`;
       await sendEmail(req.body.email, "Password reset", link, html);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}


const passwordResetLocataire = async(req, res) => {

    try {
      
        // Validate user suplied password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        
        // Verify if Locataire exists
        const {id} = req.params.userId;
        const locataire = await prisma.locataires.findUnique({
            where : {
                id : Number(req.params.userId)
            }
        });

        if (!locataire) return res.status(400).send("invalid link or expired");

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
            user_id: locataire.id,
            token: req.params.token
        }});
        if (!token) return res.status(400).send("Invalid link")
        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                    user_id: locataire.id,
                    token: req.params.token
                }
                });
         return res.status(400).send("expired link")
        }

        // token still valide
                // hash password
                 const passwordHash = bcrypt.hashSync(req.body.password, 10);

                // update password
                    const updatePassword = await prisma.locataires.update({
                    where : {
                        id : Number(req.params.userId)
                    },
                    data : {
                        password : passwordHash
                    }
                    });

                    // delete the token 
            const deleteToken = await prisma.token.deleteMany({
                where : {
                    user_id: locataire.id,
                    token: req.params.token
                }
                });


                    res.send("password reset sucessfully.");      

       
    }
     catch (error) {
       res.send("An error occured");
       console.log(error);
    }
}



// RESET PASSWORD FOR AM
const passwordResetDemandAM = async(req, res) => {
    try {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        
        // Check if AM exists
        const AM = await prisma.AgentsMaintenance.findFirst({
            where : {
                email : req.body.email 
            } });
        
        if (!AM)
            return res.status(400).send("AM with given email doesn't exist");
        
        // Create token
        
        let token = await prisma.Token.findFirst({ 
            where : {
            email: AM.email,
        }});
        if (!token) {
            token = await prisma.Token.create({
                data : {
                user_id: AM.agent_id,
                email: AM.email,
                token: jwt.sign({user_id : AM.agent_id}, crypto.randomBytes(32).toString("hex"))
                }
            });
        }
        
        // Create template for email content
        const html = `
        <!DOCTYPE html>
        <html>
            <body>
                <h2>Click here to reset your password</h2>
                <a href="${process.env.BASE_URL}/mobile_passwordReset/agent/${AM.agent_id}/${token.token}">Reset here</a>
            </body>
        </html>
                           `;
       const link = `you can reset your password by following this link ${process.env.BASE_URL}/forgot-password/${AM.agent_id}/${token}`;
       await sendEmail(req.body.email, "Password reset", link, html);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}


const passwordResetAM = async(req, res) => {

    try {
      
        // Validate user suplied password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        
        // Verify if AM exists
        const {id} = req.params.userId;
        const AM = await prisma.AgentsMaintenance.findUnique({
            where : {
                agent_id : Number(req.params.userId)
            }
        });

        if (!AM) return res.status(400).send("invalid link or expired");

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
            user_id: AM.agent_id,
            token: req.params.token
        }});
        if (!token) return res.status(400).send("Invalid link")
        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                    user_id: AM.agent_id,
                    token: req.params.token
                }
                });
         return res.status(400).send("expired link")
        }
       
           
                 
                // hash password
                 const passwordHash = bcrypt.hashSync(req.body.password, 10);

                // update password
                    const updatePassword = await prisma.AgentsMaintenance.update({
                    where : {
                        agent_id: Number(req.params.userId)
                    },
                    data : {
                        password : passwordHash
                    }
                    });

                // delete the token 
                  const deleteToken = await prisma.token.deleteMany({
                where : {
                    user_id: AM.agent_id,
                    token: req.params.token
                }
                });
                    res.send("password reset sucessfully.");
       
    }
     catch (error) {
       res.send("An error occured");
       console.log(error);
    }
}
module.exports = {
    passwordResetDemandLocataire,
    passwordResetLocataire,
    passwordResetDemandAM,
    passwordResetAM
}