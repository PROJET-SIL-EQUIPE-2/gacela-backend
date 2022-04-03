const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const deleteLocataire = () => {

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
                }
            }
        }else{
            return {
                code: 400,
                data:{
                    success: false,
                    message: "No agent with this email was found"
                }
            }
        }
    }catch (e){
        return {
            code: 500,
            data: "Server error",
            serviceError: e
        }
    }
}

module.exports = {
    deleteLocataire,
    deleteAM
}