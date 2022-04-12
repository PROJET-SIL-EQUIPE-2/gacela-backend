const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// UPDATE PASSWORD FOR LOCATAIRE
const passwordUpdateLocataire = async(id, oldPassword, newPassword) => {
   
    try{
    const locataire = await prisma.locataires.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!locataire) return {
        code : 400,
        data: { success: false, errors: [{ msg: `User doesn't exist` }] }
    };

    // Check the old password 
    const oldPasswordMatch = await bcrypt.compare(oldPassword, locataire.password);
    if (!oldPasswordMatch)
    return {
        code : 400,
        data: { success: false, errors: [{ msg: `Le mot de passe entré est incorrect` }] }
    };
  
    // Check the new password
    const passwordMatch = await bcrypt.compare(newPassword, locataire.password);
    if (passwordMatch)
    return {
        code : 400,
        data: { success: false, errors: [{ msg: `You can't use the same password` }] }
    };
   
    // hash the password
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

     // update password
     const updatePassword = await prisma.locataires.update({
        where : {
            id: Number(id)
        },
        data : {
            password : passwordHash
        }
        });

        return {
            code : 200,
            data: { success: true, errors: [{ msg: `Password updated successfully` }] }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}


 // update email locataire
 const emailUpdateLocataire = async (id, newEmail) => {


 
  try{

      const locataire = await prisma.locataires.findUnique({
          where: {
              id: Number(id)
          }
      });

      if (!locataire) 
      return {
        code : 400,
        data: { success: false, errors: [{ msg: `Locataire doesn't exist` }] }
    };


       // update email
       const updateEmail = await prisma.locataires.update({
          where : {
              id: Number(id)
          },
          data : {
              email : newEmail
          }
          });
          return {
            code : 200,
            data: { success: true, errors: [{ msg: `Email updated successfully` }] }
        };

  }catch(e){
      console.error(e);
      return {
        code : 500,
        data: { success: false, errors: [{ msg: `Server error` }] }
    };
  }

}

 // UPDATE PASSWORD FOR AM
 const passwordUpdateAM = async(id, oldPassword, newPassword) => {
   
    try{

        const am = await prisma.AgentsMaintenance.findUnique({
            where: {
                agent_id: Number(id)
            }
        });

        if (!am) 
        return {
            code : 400,
            data: { success: false, errors: [{ msg: `Agent doesn't exist` }] }
        };
        // Check the old password 
        const oldPasswordMatch = await bcrypt.compare(oldPassword, am.password);
        if (!oldPasswordMatch)
            return {
                code : 400,
                data: { success: false, errors: [{ msg: `Le mot de passe entré est incorrect` }] }
            };
        // Check the new password
         const passwordMatch = await bcrypt.compare(newPassword, am.password);
        if (passwordMatch)
        return {
            code : 400,
            data: { success: false, errors: [{ msg: `You can't use the same password` }] }
        };
        
       
        // hash the password
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

         // update password
         const updatePassword = await prisma.AgentsMaintenance.update({
            where : {
                agent_id: Number(id)
            },
            data : {
                password : passwordHash
            }
            });
            return {
                code : 200,
                data: { success: true, errors: [{ msg: `Password updated successfully` }] }
            };

    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }

}


    // update email agent
    const emailUpdateAM = async (id, newEmail) => {

      try{

          const am = await prisma.AgentsMaintenance.findUnique({
              where: {
                  agent_id: Number(id)
              }
          });
  
          if (!am) 
          return {
            code : 400,
            data: { success: false, errors: [{ msg: `Agent doesn't exist` }] }
        };
        
  
           // update email
           const updateEmail = await prisma.AgentsMaintenance.update({
              where : {
                  agent_id: Number(id)
              },
              data : {
                  email : newEmail
              }
              });
              return {
                code : 200,
                data: { success: true, errors: [{ msg: `Email updated successfully` }] }
            };

      }catch(e){
          console.error(e);
          return {
                code : 500,
                data: { success: false, errors: [{ msg: `Server error` }] }
            };
      }

  }


module.exports = {
 passwordUpdateLocataire,
 emailUpdateLocataire,
 passwordUpdateAM,
 emailUpdateAM
}