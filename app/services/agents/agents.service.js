const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();


const getAllAgents = async () => {
    try {
        const allAgents = await prisma.AgentsMaintenance.findMany({});
        return {
            code: 200,
            data: {
                success: true,
                data: {
                    allAgents
                }
            },
        }
    }catch (e){
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const getById = async (id) => {
    try {
        const agent = await prisma.AgentsMaintenance.findUnique({
            where: {
                agent_id: id
            }
        })
        if (agent){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        agent
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No agent with id ${id} that was found`
                }
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            log: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

module.exports = {
    getAllAgents,
    getById
}