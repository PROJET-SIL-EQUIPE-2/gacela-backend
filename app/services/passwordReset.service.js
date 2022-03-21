const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto")
//const sendEmail = require("../utils/sendEmail");
const sendEmail = require("../utils/sendEmail(old)");

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const emailValidate = (data) => {
    // email validation
    const validationSchema = Joi.object({
        email: Joi.string().email().required()
    });
    return validationSchema.validate(data)
}

const passwordValidate = (data) => {
    // password validation
    const validationSchema = Joi.object({
        password: Joi.string().min(8).max(255).required(),
    });
    return validationSchema.validate(data)
}

const requestPasswordResetAdmin = async (req , res) => {
    try{
        // Validate Admin's email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        
        // Check if Admin exists
        const Admin = await prisma.Admins.findFirst({
            where : {
                email : req.body.email 
            } });
        
        if (!Admin)
            return res.status(400).send("Admin with given email doesn't exist");
        
        // Create token
        

        let token = await prisma.TokenAdmin.findFirst({ 
            where : {
            email: Admin.email 
        }});
        if (!token) {
            token = await prisma.TokenAdmin.create({
                data : {
                user_id: Admin.admin_id,
                email: Admin.email,
                token: jwt.sign({user_id : Admin.admin_id}, crypto.randomBytes(32).toString("hex"))
                }
            });
        }
      
        // Link of reset
       
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
         /*const link = `${process.env.BASE_URL}/passwordReset?token=${token.token}&id=${Admin.admin_id}`;
        await sendEmail(req.body.email,"Password Reset",{name: Admin.prenom,link: link,} ,"./template/requestResetPassword.handlebars");
 */
        
     

        
}



    
const passwordResetAdmin = async(req, res) => {

    try {
      
        // Validate Admin's password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        
        // Verify if Admin exists
        const {id} = req.params.userId;
        const Admin = await prisma.Admins.findUnique({
            where : {
                admin_id : Number(req.params.userId)
            }
        });

        if (!Admin) return res.status(400).send("invalid link or expired");

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
            user_id: Admin.admin_id,
            token: req.params.token
        }});
        if (!token) return res.status(400).send("Invalid link")
        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                    user_id: Admin.admin_id,
                    token: req.params.token
                }
                });
         return res.status(400).send("expired link")
        }

        // token still valide
                // hash password
                 const passwordHash = bcrypt.hashSync(req.body.password, 10);

                // update password
                    const updatePassword = await prisma.Admin.update({
                    where : {
                        admin_id : Number(req.params.userId)
                    },
                    data : {
                        password : passwordHash
                    }
                    });

                    // delete the token 
            const deleteToken = await prisma.token.deleteMany({
                where : {
                    user_id: Admin.admin_id,
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
    requestPasswordResetAdmin,
    passwordResetAdmin,
    
}
