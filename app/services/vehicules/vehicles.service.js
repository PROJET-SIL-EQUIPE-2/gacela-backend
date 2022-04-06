
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();


const getAll = async () => {
    try {
        const allVehicles = await prisma.Vehicules.findMany({
            include: {
                AgentsMaintenance: true
            }
        });
        return {
            code: 200,
            data: {
                success: true,
                data: {
                    allVehicles
                }
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

const getById = async (id) => {
    try {
        const vehicule = await prisma.Vehicules.findUnique({
            where: {
                vehicule_id: id
            }
        })
        if (vehicule){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        vehicule
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No vehicule with id ${id} that was found`
                },
                log: `No vehicule with id ${id} that was found`
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


const addVehicle = async (
    type,
    mileage,
    price_per_hour
) => {
    try {
        const newVehicle = await prisma.Vehicules.create({
            data:  {
                type_vehicule: type,
                kilometrage: mileage,
                price_per_hour: price_per_hour
            }
        });
        if (newVehicle){
            return {
                code: 201,
                data: {
                    success: true,
                    data: {
                        msg: "Vehicle registered"
                    }
                },
                log: "Vehicle registered"
            }
        }
        return {
            code: 400,
            data: {
                success: false,
                data: 'Vehicle can not be added'
            },
            log: 'Vehicle can not be added'
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

const deleteVehicule = async (id) => {
    try {
        const deleted = await prisma.Vehicules.delete({
            where: {
                vehicule_id: id
            }
        });

        if (deleted){
            return {
                code: 200,
                data: {
                    success: true,
                    data: "Vehicule deleted"
                },
                log: "Vehicule deleted"
            }
        }else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: "Vehicule could not be deleted"
                },
                log: "Vehicule could not be deleted"
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
    getAll,
    getById,
    addVehicle,
    deleteVehicule
}