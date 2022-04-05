
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
            data: allVehicles
        }
    }catch (e){
        return {
            code: 500,
            data: "Server error",
            serviceError: e
        }
    }
}

const getOnly = async (n) => {

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
                }
            }
        }
        return {
            code: 400,
            data: {
                success: false,
                errors: [{
                    msg: 'Vehicle can not be added'
                }]
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: "Server error",
            serviceError: e
        }
    }
}

module.exports = {
    getAll,
    addVehicle
}