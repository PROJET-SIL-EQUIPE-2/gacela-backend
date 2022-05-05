const carsService = require("../vehicules/vehicles.service")

const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();



const createFacturation = async (reservation_id , estimated_price) => {
    let newFacturation;
    try {
        newFacturation = await prisma.Facture.create({
            data: {
                reservation_id: reservation_id,
                estimated_price: estimated_price,
            }
        });

        if (newFacturation) {
            return {
                code: 201,
                data: {
                    success: true,
                    data: {
                        msg: "Invoicing finished."
                    }
                }
            }
        }
        return {
            code: 400,
            data: {
                success: false,
                errors: [{
                    msg: 'Oops! Something went wrong.'
                }]
            }
        }
    } catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }

}

const getFacturationById = async (id) => {
    try {
        const facturation = await prisma.Facture.findUnique({
            where: {
                facturation_id: id
            },
        })
        if (facturation){
            return {
                code: 200,
                data: {
                    success: true,
                    data: {
                        facturation
                    }
                }
            }
        }
        else{
            return {
                code: 400,
                data: {
                    success: false,
                    data: `No facturation with id ${id} that was found`
                }
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Server error, ${e.meta.cause}`,
            serviceError: e
        }
    }
}

const updateRealPrice = async (id_facturation, realPrice) => {
    const reservation = await getFacturationById(id_facturation);
    if (reservation) {
        await prisma.Facture.update({
            where: {
                facturation_id: id_facturation,
            },
            data: {
                real_price: realPrice
            }
        })
    }
}


module.exports = {
    createFacturation,
    getFacturationById,
    updateRealPrice
}