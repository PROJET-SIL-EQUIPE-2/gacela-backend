const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const deleteLocataire = async (email) => {
    try {
        const deleted = await prisma.Locataires.delete({
            where:{
                email: email
            }
        })
        if (deleted){

            return {
                code: 200,
                data: {
                    success: true,
                    message: "Locataire deleted"
                },
                log: "Locataire deleted"
            }
        }else {

            return {
                code: 400,
                data:{
                    success: false,
                    message: "No locataire with this email was found"
                },
                log: "No locataire with this email was found"
            }
        }
    }catch (e){
        console.log("delete");
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const deleteAM = async (email) => {
    try {
        const agent = await prisma.AgentsMaintenance.delete({
            where:{
                email: email
            }
        });
        if (agent){
            // Agent deleted
            return {
                code: 200,
                data: {
                    success: true,
                    message: "Agent deleted"
                },
                log: "Agent deleted"
            }
        }else{
            return {
                code: 400,
                data:{
                    success: false,
                    message: "No agent with this email was found"
                },
                log: "No agent with this email was found"
            }
        }
    }catch (e){
        return {
            code: 500,
            data: "Server error, could not delete Agent",
            log: "Server error, could not delete Agent",
            serviceError: e
        }
    }
}

module.exports = {
    deleteLocataire,
    deleteAM
}