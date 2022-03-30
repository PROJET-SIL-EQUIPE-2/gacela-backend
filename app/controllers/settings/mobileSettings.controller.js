const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()




const passwordValidate = (data) => {
    // Validate password
    const validationSchema = Joi.object({
        password: Joi.string().min(8).max(255).required(),
    });
    return validationSchema.validate(data)
}

const emailValidate = (data) => {
    // Validate email
    const validationSchema = Joi.object({
        email: Joi.string().email().required()
    });
    return validationSchema.validate(data)
}

// UPDATE PASSWORD FOR LOCATAIRE
const passwordUpdateLocataire = async(req, res) => {
    // Validate user supplied data
    const { error } = passwordValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract validated data from body
    const newPassword = req.body.password;

    try{

        const locataire = await prisma.locataires.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!locataire) return res.status(400).send({ errors: [{
            msg: "Locataire doesn't exist"
        }]});

        // Check the password
        const passwordMatch = await bcrypt.compare(newPassword, locataire.password);
        if (passwordMatch)
            return res
                .status(400)
        .json({ success: false, errors: [{ msg: "You can't use the same password" }] });
       
        // hash the password
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

         // update password
         const updatePassword = await prisma.locataires.update({
            where : {
                id: Number(req.params.id)
            },
            data : {
                password : passwordHash
            }
            });

                 return res.status(200).json({
                    success: true,
                    data: {
                        msg: "Password updated successfully"
                    }
                });

    }catch(e){
        console.error(e);
        return res.status(500).send("Server error");
    }

}



    // update email locataire
    const emailUpdateLocataire = async (req,res) => {
          // Validate user supplied data
    const { error } = emailValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
        }

            // Extract validated data from body
             const newEmail = req.body.email;
        try{

            const locataire = await prisma.locataires.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
    
            if (!locataire) return res.status(400).send({ errors: [{
                msg: "Locataire doesn't exist"
            }]});
    
    
             // update email
             const updateEmail = await prisma.locataires.update({
                where : {
                    id: Number(req.params.id)
                },
                data : {
                    email : newEmail
                }
                });
    
                     return res.status(200).json({
                        success: true,
                        data: {
                            msg: "Email updated successfully"
                        }
                    });
    
        }catch(e){
            console.error(e);
            return res.status(500).send("Server error");
        }

    }

    // UPDATE PASSWORD FOR AM
const passwordUpdateAM = async(req, res) => {
    // Validate user supplied data
    const { error } = passwordValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract validated data from body
    const newPassword = req.body.password;

    try{

        const am = await prisma.AgentsMaintenance.findUnique({
            where: {
                agent_id: Number(req.params.id)
            }
        });

        if (!am) return res.status(400).send({ errors: [{
            msg: "Agent doesn't exist"
        }]});

        // Check the password
         const passwordMatch = await bcrypt.compare(newPassword, am.password);
        if (passwordMatch)
            return res
                .status(400)
        .json({ success: false, errors: [{ msg: "You can't use the same password" }] }); 
       
        // hash the password
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

         // update password
         const updatePassword = await prisma.AgentsMaintenance.update({
            where : {
                agent_id: Number(req.params.id)
            },
            data : {
                password : passwordHash
            }
            });

                 return res.status(200).json({
                    success: true,
                    data: {
                        msg: "Password updated successfully"
                    }
                });

    }catch(e){
        console.error(e);
        return res.status(500).send("Server error");
    }

}


    // update email agent
    const emailUpdateAM = async (req,res) => {
        // Validate user supplied data
  const { error } = emailValidate(req.body);
  if (error) {
      // Bad request
      return res.status(400).json({
          errors: [{ msg: error.details[0].message }]
      });
      }

          // Extract validated data from body
           const newEmail = req.body.email;
      try{

          const am = await prisma.AgentsMaintenance.findUnique({
              where: {
                  agent_id: Number(req.params.id)
              }
          });
  
          if (!am) return res.status(400).send({ errors: [{
              msg: "Agent doesn't exist"
          }]});
  
  
           // update email
           const updateEmail = await prisma.AgentsMaintenance.update({
              where : {
                  agent_id: Number(req.params.id)
              },
              data : {
                  email : newEmail
              }
              });
  
                   return res.status(200).json({
                      success: true,
                      data: {
                          msg: "Email updated successfully"
                      }
                  });
  
      }catch(e){
          console.error(e);
          return res.status(500).send("Server error");
      }

  }

module.exports = {
    passwordUpdateLocataire,
    emailUpdateLocataire,
    passwordUpdateAM,
    emailUpdateAM
}