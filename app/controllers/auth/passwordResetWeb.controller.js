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

// RESET PASSWORD FOR  ADMIN
const passwordResetDemandAdmin = async(req, res) => {
    try {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send({
            message :error.details[0].message,
            success : false
        });
        
        // Check if Admin exists
        const admin = await prisma.Admins.findFirst({
            where : {
                email : req.body.email 
            } });
        
        if (!admin) {
           return await passwordResetDemandDecideur(req , res) ; 
          /*  return res.status(400).send({
            message: "user with given email doesn't exist"
        });
 */
        }
            
        
        // Create token
        

        let token = await prisma.Token.findFirst({ 
            where : {
              id_admin: admin.admin_id,
            email: admin.email 
        }});
        if (!token) {
            token = await prisma.Token.create({
                data : {
                  id_admin: admin.admin_id,
                email: admin.email ,
                token: jwt.sign({id_admin : admin.admin_id}, crypto.randomBytes(32).toString("hex"))
                }
            });
        }
        const a = 0 ;
        // Create template for email content
        const html = `
        <!DOCTYPE html>
        <html>
            <body>
                <h2>Click here to reset your password</h2>
                <a href="${process.env.BASE_URL}/web_passwordReset/admin/${a}/${admin.admin_id}/${token.token}">Reset here</a>
            </body>
        </html>
                           `;
       const link = `you can reset your password by following this link ${process.env.BASE_URL}/forgot-password/${admin.admin_id}/${token.token}`;
       await sendEmail(req.body.email, "Password reset", link, html);
        res.status(200).send({
            message: 'password reset link sent to your email account'
        });
    } catch (error) {
        res.status(500).send({message :"An error occured"});
        console.log(error);
    }
}


const passwordResetAdmin = async(req, res) => {

    
        
        // Verify if Admins exists
        const {id} = req.params.userId;
        const a = req.params.a;
        if (Number(a) == 0 ) {

            try {
      
                // Validate user suplied password 
                const schemaValidation = Joi.object({ email: Joi.string().email().required() });
                const { error } = passwordValidate(req.body);
                if (error) return res.status(400).send({
                    message : error.details[0].message,
                success : false});
                const admin = await prisma.admins.findUnique({
                    where : {
                        admin_id : Number(req.params.userId) ,
        
                    }
                });
        
                if (!admin) {
/*                   return await passwordResetDecideur(req , res);
 */        
                      return res.status(400).send({
                        message : "invalid link or expired",
                    success : false});  
        
                } 
        
                // Verify if token isn't expired
        
                let token = await prisma.Token.findFirst({ 
                    where : {
                      id_admin: admin.admin_id,
                    token: req.params.token
                }});
                if (!token) return res.status(400).send({message : "Invalid link for admin",
            success : false})
                if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
                      // delete the token 
                      const deleteToken = await prisma.token.deleteMany({
                        where : {
                          id_admin: admin.admin_id,
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
                            const updatePassword = await prisma.admins.update({
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
                          id_admin: admin.admin_id,
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
        else if (Number(a) == 1) {


            try {
      
                // Validate user suplied password 
                const schemaValidation = Joi.object({ email: Joi.string().email().required() });
                const { error } = passwordValidate(req.body);
                if (error) return res.status(400).send({
                    message : error.details[0].message,
                success : false});
                
                // Verify if Admins exists
                const {id} = req.params.userId;
                const decideur = await prisma.decideurs.findUnique({
                    where : {
                      decideur_id : Number(req.params.userId)
                    }
                });
        
                if (!decideur) return res.status(400).send({
                    message : "invalid link or expired",
                success : false});
        
                // Verify if token isn't expired
        
                let token = await prisma.Token.findFirst({ 
                    where : {
                      id_decideur: decideur.decideur_id,
                    token: req.params.token
                }});
                if (!token) return res.status(400).send({message : "Invalid link for decideur",
            success : false})
                if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
                      // delete the token 
                      const deleteToken = await prisma.token.deleteMany({
                        where : {
                          id_decideur: decideur.decideur_id,
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
                            const updatePassword = await prisma.decideurs.update({
                            where : {
                              decideur_id : Number(req.params.userId)
                            },
                            data : {
                                password : passwordHash
                            }
                            });
        
                            // delete the token 
                    const deleteToken = await prisma.token.deleteMany({
                        where : {
                          id_decideur: decideur.decideur_id,
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


        
       
   /*  }
     catch (error) {
       res.status(500).send({
           message : "An error occured"});
       console.log(error);
    } */
}



// RESET PASSWORD FOR  Decideurs
const passwordResetDemandDecideur = async(req, res) => {
    try {
         
        // Validate user suplied email 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailValidate(req.body);
        if (error) return res.status(400).send({
            message :error.details[0].message,
            success : false
        });
        
        // Check if Admin exists
        const decideur = await prisma.decideurs.findFirst({
            where : {
                email : req.body.email 
            } });
        
        if (!decideur)
            return res.status(400).send({
                message: "user with given email doesn't exist"
            });
        
        // Create token
        

        let token = await prisma.Token.findFirst({ 
            where : {
              id_decideur: decideur.decideur_id,
            email: decideur.email 
        }});
        if (!token) {
            token = await prisma.Token.create({
                data : {
                  id_decideur: decideur.decideur_id,
                email: decideur.email ,
                token: jwt.sign({id_decideur : decideur.decideur_id}, crypto.randomBytes(32).toString("hex"))
                }
            });
        }
        const a = 1 ;
        // Create template for email content
        const html = `
        <!DOCTYPE html>
        <html>
            <body>
                <h2>Click here to reset your password</h2>
                <a href="${process.env.BASE_URL}/web_passwordReset/admin/${a}/${decideur.decideur_id}/${token.token}">Reset here</a>
            </body>
        </html>
                           `;
       const link = `you can reset your password by following this link ${process.env.BASE_URL}/forgot-password/${decideur.decideur_id}/${token.token}`;
       await sendEmail(req.body.email, "Password reset", link, html);
        res.status(200).send({
            message: 'password reset link sent to your email account'
        });
    } catch (error) {
        res.send({message :"An error occured"});
        console.log(error);
    }
}


const passwordResetDecideur = async(req, res) => {

    try {
      
        // Validate user suplied password 
        const schemaValidation = Joi.object({ email: Joi.string().email().required() });
        const { error } = passwordValidate(req.body);
        if (error) return res.status(400).send({
            message : error.details[0].message,
        success : false});
        
        // Verify if Admins exists
        const {id} = req.params.userId;
        const decideur = await prisma.decideurs.findUnique({
            where : {
              decideur_id : Number(req.params.userId)
            }
        });

        if (!decideur) return res.status(400).send({
            message : "invalid link or expired",
        success : false});

        // Verify if token isn't expired

        let token = await prisma.Token.findFirst({ 
            where : {
              id_decideur: decideur.decideur_id,
            token: req.params.token
        }});
        if (!token) return res.status(400).send({message : "Invalid link for decideur",
    success : false})
        if(Date.now() > (token.createdAt.getTime() + (3600*1000))){
              // delete the token 
              const deleteToken = await prisma.token.deleteMany({
                where : {
                  id_decideur: decideur.decideur_id,
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
                    const updatePassword = await prisma.decideurs.update({
                    where : {
                      decideur_id : Number(req.params.userId)
                    },
                    data : {
                        password : passwordHash
                    }
                    });

                    // delete the token 
            const deleteToken = await prisma.token.deleteMany({
                where : {
                  id_decideur: decideur.decideur_id,
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


module.exports = {
    passwordResetDemandAdmin,
    passwordResetAdmin,
    passwordResetDecideur,
    passwordResetDemandDecideur
}