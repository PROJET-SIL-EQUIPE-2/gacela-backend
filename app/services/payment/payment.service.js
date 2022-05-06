const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();

/**
 * Makes a call to an external service for the actual checkout of a facturation
 * @param  {[type]} in [description]
 * @return {[type]}     [description]
 */
const checkout = () => {

}

/**
 * Registers a local image for the checkout that links to reservation
 */
const registerLocalCheckout = () => {

}

/**
 * Returns the payment associated to a reservation
 * @param {[Int]} reservation_id
 * @return {[Payment]} payment object of that reservation
 */
const getPaymentOfReservation = async (reservation_id) => {
    try {
        return await prisma.Paiment.findFirst({
            select: {
                paiment_id: true,
                facture_id: true,
                date_paiment: true,
                type_paiment: true,
                facture: {
                    select: {
                        facture_id: true,
                        reservation_id: true,
                        estimated_price: true,
                        real_price: true,
                        paid: true
                    },
                    where: {
                        reservation_id: reservation_id
                    }
                }
            }
        })
    }catch (e) {

    }
}


const getPaymentById = async (payment_id) => {
    try {
        return await prisma.Paiment.findUnique({
            where:{
                paiment_id: payment_id
            }
        })
    }catch (e) {

    }
}

module.exports = {
    checkout,
    registerLocalCheckout,
    getPaymentOfReservation,
    getPaymentById
}