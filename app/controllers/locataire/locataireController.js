const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();


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

const getNonValidatedLocataires = async (req, res) => {
    try {
        const validated = await prisma.locataires.findMany({
            where: {
                validated: false
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
        return res.send(validated);

    }catch (e){
        console.error(e);
        return res.status(500).json("Server error");

    }
}



module.exports = {
    getValidatedLocataires,
    getNonValidatedLocataires
}