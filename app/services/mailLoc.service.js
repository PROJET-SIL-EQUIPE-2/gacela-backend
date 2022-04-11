const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto")
const sendEmail = require("../../utils/sendEmail");
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
const Demandevalidate = async (req , res) => {
    const {id} = req.params.userId;
        const locataire = await prisma.Locataires.findUnique({
            where : {
                id : Number(req.params.userId),
            }
        });
        if (!locataire)
        return res.status(400).send({
            message: "user with given email doesn't exist"
        });
        else { //metttre a jour le champs validated
            newLoc = await prisma.Locataires.update({
                data : {
                validate : true,
               
                
                },
                where : {
                    id_locataire: locataire.id,
                }
            });

            const html = `
            <!DOCTYPE html>
            <html>
                <body>
                    <h2>Acceptation de registration</h2>
                    <p> Votre demande de registration à Gacella a été acceptée. Vous pouvez désormais vous connecter à votre compte.</p>
                </body>
            </html>
                               `;
            const text = "Votre demande de registration à Gacella a été acceptée. Vous pouvez désormais vous connecter à votre compte." ;
           await sendEmail(req.body.email, "Acceptation de regigistration", text, html);
            res.status(200).send({
                message: 'password reset link sent to your email account'
            });
       

        }


}

const DemandeReject = async (req , res) => {
    const {id} = req.params.userId;
        const locataire = await prisma.Locataires.findUnique({
            where : {
                id : Number(req.params.userId),
            }
        });
        if (!locataire)
        return res.status(400).send({
            message: "user with given email doesn't exist"
        });
        else { //metttre a jour le champs validated
            newLoc = await prisma.Locataires.update({
                data : {
                validate : false,
               
                
                },
                where : {
                    id_locataire: locataire.id,
                }
            });
            const demandeId = await prisma.demandesInscription.findUnique({
                where : {
                    locataire_id : locataire.id,
                }
            });

            const justificatif = await prisma.demandesInscriptionRejected.findUnique({
                where : {
                    demande_id : demandeId,
                }
            });

            const html = `
            <!DOCTYPE html>
            <html>
                <body>
                    <h2>Rejet de registration</h2>
                    <p> Votre demande de registration à Gacella a été malheureusement rejetée car `+ justificatif + `. </p>
                    
                </body>
            </html>
                               `;
            const text = "Votre demande de registration à Gacella a été acceptée. Vous pouvez désormais vous connecter à votre compte." ;
           await sendEmail(req.body.email, "Acceptation de regigistration", text, html);
            res.status(200).send({
                message: 'password reset link sent to your email account'
            });
       

        }


}

// RESET PASSWORD FOR LOCATAIRE
const passwordResetDemandLocataire = async(req, res) => {
    try {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send({
            message :error.details[0].message,
            success : false
        });
        
        // Check if Locataire exists
        const locataire = await prisma.Locataires.findFirst({
            where : {
                email : req.body.email 
            } });
        
        if (!locataire)
            return res.status(400).send({
                message: "user with given email doesn't exist"
            });
        
        // Create token
        

        let token = await prisma.Token.findFirst({ 
            where : {
            id_locataire: locataire.id,
            email: locataire.email 
        }});
        if (!token) {
            token = await prisma.Token.create({
                data : {
                id_locataire: locataire.id,
                email: locataire.email,
                token: jwt.sign({id_locataire : locataire.id}, crypto.randomBytes(32).toString("hex"))
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
        res.status(200).send({
            message: 'password reset link sent to your email account'
        });
    } catch (error) {
        res.send({message :"An error occured"});
        console.log(error);
    }
}


const passwordResetLocataire = async(req, res) => {

    try {
      
        // Validate user suplied password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send({
            message : error.details[0].message,
        success : false});
        
        // Verify if Locataire exists
        const {id} = req.params.userId;
        const locataire = await prisma.locataires.findUnique({
            where : {
                id : Number(req.params.userId)
            }
        });

        if (!locataire) return res.status(400).send({
            message : "invalid link or expired",
        success : false});

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
            id_locataire: locataire.id,
            token: req.params.token
        }});
        if (!token) return res.status(400).send({message : "Invalid link",
    success : false})
        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                    id_locataire: locataire.id,
                    token: req.params.token
                }
                });
         return res.status(400).send({
             message : "expired link",
            success : false})
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
                    id_locataire: locataire.id,
                    token: req.params.token
                }
                });


                    res.status(200).send({
                        message : "password reset sucessfully."
                }); 
       
    }
     catch (error) {
       res.send({
           message : "An error occured"});
       console.log(error);
    }
}



// RESET PASSWORD FOR AM
const passwordResetDemandAM = async(req, res) => {
    try {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send({
            message : error.details[0].message,
        success : false});
        
        // Check if AM exists
        const AM = await prisma.AgentsMaintenance.findFirst({
            where : {
                email : req.body.email 
            } });
        
        if (!AM)
            return res.status(400).send({message :"AM with given email doesn't exist"});
        
        // Create token
        
        let token = await prisma.Token.findFirst({ 
            where : {
            id_AM : AM.agent_id,
            email: AM.email
        }});
        if (!token) {
            token = await prisma.Token.create({
                data : {
                id_AM: AM.agent_id,
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

        res.status(200).send({ message : "password reset link sent to your email account",
        success: true});
    } catch (error) {
        res.send({message : "An error occured"});
        console.log(error);
    }
}


const passwordResetAM = async(req, res) => {

    try {
      
        // Validate user suplied password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send({ message :error.details[0].message,
        success : false});
        
        // Verify if AM exists
        const {id} = req.params.userId;
        const AM = await prisma.AgentsMaintenance.findUnique({
            where : {
                agent_id : Number(req.params.userId)
            }
        });

        if (!AM) return res.status(400).send({message :"invalid link or expired",
    success : false});

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
            id_AM: AM.agent_id,
            token: req.params.token
        }});
        if (!token) return res.status(400).send({message :"Invalid link",
    success : false})
        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                    id_AM: AM.agent_id,
                    token: req.params.token
                }
                });
         return res.status(400).send({message :"expired link"})
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
                    id_AM: AM.agent_id,
                    token: req.params.token
                }
                });
                    res.status(200).send({message :"password reset sucessfully.",
                success : true});
       
    }
     catch (error) {
       res.send({message : "An error occured"});
       console.log(error);
    }
}
module.exports = {
    passwordResetDemandLocataire,
    passwordResetLocataire,
    passwordResetDemandAM,
    passwordResetAM
}