const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto")
const sendEmail = require("../../utils/sendEmail");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// RESET PASSWORD FOR LOCATAIRE
const passwordResetDemandLocataire = async(email) => {
    try {
         

        
        // Check if Locataire exists
        const locataire = await prisma.Locataires.findFirst({
            where : {
                email : email 
            } });
        
        if (!locataire)
        return {
            code: 400,
            data: { success: false, errors: [{ msg: "user with given email doesn't exist" }] }
          }
        
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
       await sendEmail(email, "Password reset", link, html);
       return {
        code: 200,
        data: { success: true,  msg: "password reset link sent to your email account" }
      }
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            data: { success: false, errors: [{ msg: "Server error" }] }
          }
        
    }
}


const passwordResetLocataire = async(id, atoken, password ) => {

    try {
     
        const locataire = await prisma.locataires.findUnique({
            where : {
                id : Number(id)
            }
        });

        if (!locataire)
        return {
            code: 400,
            data: { success: false, errors: [{ msg: "invalid link or expired" }] }
          }

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
            id_locataire: locataire.id,
            token: atoken
        }});
        if (!token)
        return {
            code: 400,
            data: { success: false, errors: [{ msg: "invalid link " }] }
          }

        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                    id_locataire: locataire.id,
                    token: atoken
                }
                });
                return {
                    code: 400,
                    data: { success: false, errors: [{ msg: "expired link" }] }
                  }
        
        }

        // token still valide
                // hash password
                 const passwordHash = bcrypt.hashSync(password, 10);

                // update password
                    const updatePassword = await prisma.locataires.update({
                    where : {
                        id : Number(id)
                    },
                    data : {
                        password : passwordHash
                    }
                    });

                    // delete the token 
            const deleteToken = await prisma.token.deleteMany({
                where : {
                    id_locataire: locataire.id,
                    token: atoken
                }
                });

                return {
                    code: 200,
                    data: { success: true,msg: "password reset sucessfully"}
                  }
                    
    }
     catch (error) {
       console.log(error);
       return {
        code: 500,
        data: { success: false, errors: [{ msg: "Server error" }] }
      }
    }
}



// RESET PASSWORD FOR AM
const passwordResetDemandAM = async(email) => {
    try {
         
       
        
        // Check if AM exists
        const AM = await prisma.AgentsMaintenance.findFirst({
            where : {
                email : email 
            } });
        
        if (!AM)
        return {
            code: 400,
            data: { success: false, errors: [{ msg: "AM with given email doesn't exist" }] }
          }
        
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
       await sendEmail(email, "Password reset", link, html);
       return {
        code: 200,
        data: { success: true, msg: "password reset link sent to your email account" }
      }
    } catch (error) {
        console.log(error);
        return {
            code: 200,
            data: { success: false, errors: [{ msg: "Server error" }] }
          }
    }
}


const passwordResetAM = async(id, atoken, password) => {

    try {
     
        // Verify if AM exists
        const AM = await prisma.AgentsMaintenance.findUnique({
            where : {
                agent_id : Number(id)
            }
        });

        if (!AM)
        return {
            code: 400,
            data: { success: false, errors: [{ msg: "invalid link or expired" }] }
          }

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
            id_AM: AM.agent_id,
            token: atoken
        }});
        if (!token)
        return {
            code: 400,
            data: { success: false, errors: [{ msg: "invalid link" }] }
          }
        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                    id_AM: AM.agent_id,
                    token: atoken
                }
                });
                return {
                    code: 400,
                    data: { success: false, errors: [{ msg: "expired link" }] }
                  }
        }
       
               
                // hash password
                 const passwordHash = bcrypt.hashSync(password, 10);

                // update password
                    const updatePassword = await prisma.AgentsMaintenance.update({
                    where : {
                        agent_id: Number(id)
                    },
                    data : {
                        password : passwordHash
                    }
                    });

                // delete the token 
                  const deleteToken = await prisma.token.deleteMany({
                where : {
                    id_AM: AM.agent_id,
                    token: atoken
                }
                });

                return {
                    code: 200,
                    data: { success: true, msg: "password reset successfully." }
                  }
       
    }
     catch (error) {
       console.log(error);
       return {
        code: 500,
        data: { success: false, errors: [{ msg: "Server error" }] }
      }
    }
}

module.exports = {
    passwordResetAM,
    passwordResetLocataire,
    passwordResetDemandAM,
    passwordResetDemandLocataire
}