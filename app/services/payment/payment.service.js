const stripeSecretKey = process.env.STRIPE_SECRET_KEY
let stripe = require("stripe")(stripeSecretKey)
const PrismaClient = require("@prisma/client").PrismaClient;
const estimationService = require("./estimation.service")

const prisma = new PrismaClient();

/**
 * Makes a call to an external service for the actual checkout of a facturation
 * @param  {[type]} reservation_id [description]
 * @param stripeTokenId
 * @return {[type]}     [description]
 */
const checkout = async (reservation_id, stripeTokenId) => {
    try {
        // check if no payment before
        let payment = await getPaymentOfReservation(reservation_id)
        if (payment){
            return {
                code: 400,
                data: {
                    success: false,
                    data: "Payment has already been done"
                }
            }
        }
        // amount is the estimated price of that reservation
        let amount = await estimationService.calculateEstimatedPrice(reservation_id)
        let stripePayment = await stripe.charges.create({
            amount: amount,
            source: stripeTokenId,
            currency: 'dzd'
        })

        if(stripePayment.status === "succeeded"){
            // Real amount is known at the end of the trajectory
            await createPayment(stripePayment.id, amount, 1)
            return {
                code: 200,
                data: {
                    success: true,
                    data: "Checkout has been done successfully"
                }
            }
        }
        else if (stripePayment.status === "failed"){
            return {
                code: 200,
                data: {
                    success: false,
                    data: "Checkout failed"
                }
            }
        }
        return {
            code: 200,
            data: {
                success: true,
                data: "Checkout is pending"
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: {
                success: false,
                data: e.message
            }
        }
    }
}

/**
 * Registers a local image for the checkout that links to reservation
 */
const createPayment = async (payment_id, estimated_price, type) => {
    try {
        return await prisma.Paiment.create({
            paiment_id: payment_id,
            estimated_price: estimated_price,
            type_paiment: type
        })
    }catch (e) {
        return new Error("Payment could not be created")
    }
}

/**
 * Returns the payment associated to a reservation
 * @param {[Int]} reservation_id
 * @return {[Payment]} payment object of that reservation
 */
const getPaymentOfReservation = async (reservation_id) => {
    try {
        return await prisma.Paiment.findFirst({
            where: {
                reservation_id: reservation_id
            }
        })
    }catch (e) {
        console.log(e)
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
    getPaymentOfReservation,
    getPaymentById,
    checkout,
    createPayment
}