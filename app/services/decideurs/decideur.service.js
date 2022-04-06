const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

const getAllDecideurs = async () => {
    try {
        const allDecideurs = await prisma.Decideurs.findMany({
            select: {
                decideur_id: true,
                name: true,
                family_name: true,
                email: true,
                phone_number: true,
                blocked: true
            }
        });
        return {
            code: 200,
            data: {
                success: true,
                data: {
                    allDecideurs
                }
            }
        }
    }catch (e){
        return {
            code: 500,
            data: `Server error ${e.meta.cause}`,
            log: `Server error ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const getDecideurById = async (id) => {
    try {
        const decideur = await prisma.Decideurs.findUnique({
            where: {
                decideur_id: id
            },
            select: {
                decideur_id: true,
                name: true,
                family_name: true,
                email: true,
                phone_number: true,
                blocked: true
            }
        })
        if (decideur){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        decideur
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No decideur with id ${id} that was found`
                },
                log: `No decideur with id ${id} that was found`
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

const deleteById = async (id) => {
    try {
        const deleted = await prisma.Decideurs.delete({
            where: {
                decideur_id: id
            }
        });

        if (deleted){
            return {
                code: 200,
                data: {
                    success: true,
                    data: "Decideur deleted"
                },
                log: "Decideur deleted"
            }
        }else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: "Decideur could not be deleted"
                },
                log: "Decideur could not be deleted"
            }
        }
    }catch (e){
        return {
            code: 500,
            data: `Service error, ${e.meta.cause}`,
            log: `Service error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const deleteByEmail = async (email) => {
    try {
        const deleted = await prisma.Decideurs.delete({
            where: {
                email: email
            }
        });

        if (deleted){
            return {
                code: 200,
                data: {
                    success: true,
                    data: "Decideur deleted"
                },
                log: "Decideur deleted"
            }
        }else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: "Decideur could not be deleted"
                },
                log: "Decideur could not be deleted"
            }
        }
    }catch (e){
        return {
            code: 500,
            data: `Service error, ${e.meta.cause}`,
            log: `Service error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}


module.exports = {
    getAllDecideurs,
    getDecideurById,
    deleteById,
    deleteByEmail
}