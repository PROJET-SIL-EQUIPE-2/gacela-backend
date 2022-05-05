const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



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


module.exports = {
    Demandevalidate,
    DemandeReject,
    
}