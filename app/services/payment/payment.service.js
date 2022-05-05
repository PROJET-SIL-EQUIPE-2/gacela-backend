const PrismaClient = require("@prisma/client").PrismaClient;

const prisma = new PrismaClient();


/**
 * Makes a call to an external service for the actual checkout
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
const getPaymentOfReservation = (reservation_id) => {
    return null
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