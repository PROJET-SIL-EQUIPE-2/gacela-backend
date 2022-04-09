const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();
const accountCollections = {
    "ADMIN" : prisma.Admins,
    "AM" : prisma.AgentsMaintenance,
    "DECIDEUR" : prisma.Decideurs,
    "LOCATAIRE" : prisma.Locataires

}

const toggleBlock = async (email , accountType) => {
    try {
        const accountData = await accountCollections[accountType].findUnique({
            where: {
                email: email,
            },
        });
        console.log("ACCOUNT DATA =", accountData);
        if(!accountData){
            return {
                code: 400,
                data: {
                    success: false,
                    message: "No account with this email was found"
                }
            }
        }
        let newStatus = !accountData.blocked;
        const updatedData = await accountCollections[accountType].update({
            where: {
                email: email,
            },
            data: {
                blocked: newStatus,
            },
        });
        if (updatedData) {
            // Agent deleted
            return {
                code: 200,
                data: {
                    success: true,
                    message: newStatus ? "The account is blocked successfully ! " : "The account is unblocked successfully ! "
                }
            }
        } else {
            return {
                code: 400,
                data: {
                    success: false,
                    message: "No account with this email was found"
                }
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: "Server error",
            serviceError: e
        }
    }
}

module.exports={
    toggleBlock,
    accountCollections
}
