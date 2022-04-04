const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const passwordUpdate = async(id, oldPassword, newPassword) => {
 

    try{

        const decideur = await prisma.Decideurs.findUnique({
            where: {
                decideur_id: Number(id)
            }
        });

        if (!decideur) 
        return {
            code : 400,
            data: { success: false, errors: [{ msg: `Decideur doesn't exist` }] }
        };
        // Check the old password 
        const oldPasswordMatch = await bcrypt.compare(oldPassword, decideur.password);
        if (!oldPasswordMatch)
        return {
            code : 400,
            data: { success: false, errors: [{ msg: `Le mot de passe entré est incorrect` }] }
        };
         
        // Check the new password
        const passwordMatch = await bcrypt.compare(newPassword, decideur.password);
        if (passwordMatch)
        return {
            code : 400,
            data: { success: false, errors: [{ msg: `You can't use the same password` }] }
        };
           
       
        // hash the password
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

         // update password
         const updatePassword = await prisma.Decideurs.update({
            where : {
                decideur_id: Number(id)
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



    // update email decideur
    const emailUpdate = async (id, newEmail) => {

        try{

            const decideur = await prisma.Decideurs.findUnique({
                where: {
                    decideur_id: Number(id)
                }
            });
    
            if (!decideur) 
            return {
                code : 400,
                data: { success: false, errors: [{ msg: `Decideur doesn't exist` }] }
            };
    
    
             // update email
             const updateEmail = await prisma.Decideurs.update({
                where : {
                    decideur_id: Number(id)
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
                data: { success: true, errors: [{ msg: `Server error` }] }
            };
        }

    }

module.exports = {
    passwordUpdate,
    emailUpdate
}