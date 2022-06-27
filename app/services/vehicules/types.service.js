const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();


const getAll = async () => {
    try {
        let types = await prisma.VehiculeType.findMany()
        return {
            code: 200,
            data: {
                success: true,
                data: types
            },
            log: "Giving all types"
        }
    }catch (e){
        console.log(e)
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e,
        }
    }
}

const getType = async (type) => {
    try {
        let fetchedType = await prisma.VehiculeType.findFirst({
            where: {
                type: type
            }
        })
        return {
            code: 200,
            data: {
                success: true,
                data: fetchedType
            }
        }
    }catch (e){
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e,
        }
    }
}


const addType = async (type, price_per_hour) => {
    try {
        let insertedType = await prisma.VehiculeType.create({
            data: {
                type: type,
                price_per_hour: price_per_hour
            }
        })
        return {
            code: 200,
            data: {
                success: true,
                data: insertedType
            },
            log: `Yaaay new car type added`
        }
    }catch (e) {
        console.log(e)
        return {
            code: 500,
            data: `Server error, ${e.message}`,
            log: `Server error, ${e.message}`,
            serviceError: e
        }
    }
}

const getPriceOfType = async (type) => {
    try {
        let fetchedType = await prisma.VehiculeType.findFirst({
            where: {
                type: type
            }
        })
        return fetchedType.price_per_hour
    }catch (e) {
       return {
           code: 500,
           data: `Server error could not fetch price, ${e.message}`,
           log: `Server error could not fetch price, ${e.message}`,
           serviceError: e,
       }
    }

}

module.exports = {
    getAll,
    getType,
    addType,
    getPriceOfType
}
