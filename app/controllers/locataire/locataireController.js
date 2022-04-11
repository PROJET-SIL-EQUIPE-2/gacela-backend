const PrismaClient = require("@prisma/client").PrismaClient;
const locataireService = require("../../services/mailLoc.service") ;

const prisma = new PrismaClient();

const DEMAND_STATE_VALIDATED = 1;
const DEMAND_STATE_PENDING = 2;
const DEMAND_STATE_REJECTED = 3;

const getValidatedLocataires = async (req, res) => {
    try {
        const non_validated = await prisma.locataires.findMany({
            where: {
                validated: true
            },
            select:{
                id: true,
                email: true,
                phone_number: true,
                photo_identity: true,
                personal_photo: true,
                name: true,
                family_name: true,
                validated: true
            }
        });
        return res.send(non_validated);

    }catch (e){
        console.error(e);
        return res.status(500).json("Server error");

    }
}

const getWaitingLocataires = async (req, res) => {
    try {
        // const validated = await prisma.locataires.findMany({
        //     where: {
        //         validated: false
        //     },
        //     select:{
        //         id: true,
        //         email: true,
        //         phone_number: true,
        //         photo_identity: true,
        //         personal_photo: true,
        //         name: true,
        //         family_name: true,
        //         validated: true
        //     }
        // });
        // return res.send(validated);
        const r = await prisma.DemandesInscription.findMany({
            where: {
                etat_demande: DEMAND_STATE_PENDING
            },
            include: {
                locataire:{
                    select: {
                        family_name: true,
                        name: true,
                        email: true,
                        phone_number: true,
                        personal_photo: true,
                        photo_identity: true
                    }
                },
                etatDemandeInscription: true
            }
        })

        res.send(r);

    }catch (e){
        console.error(e);
        return res.status(500).json("Server error");

    }
}

const getRejectedLocataires = async (req, res) => {
    try {
        const r = await prisma.DemandesInscription.findMany({
            where: {
                etat_demande: DEMAND_STATE_REJECTED
            },
            include: {
                locataire:{
                    select: {
                        family_name: true,
                        name: true,
                        email: true,
                        phone_number: true,
                        personal_photo: true,
                        photo_identity: true
                    }
                },
                rejected: {
                    select: {
                        justificatif: true,
                    }
                },
                etatDemandeInscription: true
            }
        })

        res.send(r);
    }catch (e){
        console.error(e);
        return res.status(500).json("Server error");

    }
}



//valider une demande d'inscription d'un locataire dans
const Demandevalidate = (req , res) => {
    locataireService.Demandevalidate(req, res) ; 

}
//rejeter une demande d'inscription d'un locataire
const DemandeReject = (req , res) => { 
    locataireService.DemandeReject(req , res) ; 

}



module.exports = {
    getValidatedLocataires,
    getRejectedLocataires,
    getWaitingLocataires ,
    Demandevalidate ,
    DemandeReject
}