const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();


const getValidatedLocataires = async (req, res) => {
    try {
        const non_validated = await prisma.locataires.findMany({
            where: {
                validated: false
            }
        });
        return res.send(non_validated);

    }catch (e){
        console.error(e);
        res.status(500).json("Server error");

    }
    res.send("success");
}

const getNonValidatedLocataires = async (req, res) => {
    try {
        const validated = await prisma.locataires.findMany({
            where: {
                validated: false
            }
        });
        return res.send(validated);

    }catch (e){
        console.error(e);
        res.status(500).json("Server error");

    }
    res.send("success");
}



module.exports = {
    getValidatedLocataires,
    getNonValidatedLocataires
}