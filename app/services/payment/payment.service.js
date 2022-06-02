const stripeSecretKey = process.env.STRIPE_SECRET_KEY
let stripe = require("stripe")(stripeSecretKey)
const PrismaClient = require("@prisma/client").PrismaClient;
const estimationService = require("./estimation.service")
const reservationService = require("../reservations/reservation.service");
const carsService = require("../vehicules/vehicles.service");

const prisma = new PrismaClient();

/**
 * Makes a call to an external service for the actual checkout of a facturation
 * @param  {[type]} reservation_id [description]
 * @param stripeTokenId
 * @return {[type]}     [description]
 */
// const checkout = async (reservation_id, stripeTokenId, amount) => {
//     try {
//         // check if no payment before
//         let payment = await getPaymentOfReservation(reservation_id)
//         if (payment){
//             return {
//                 code: 400,
//                 data: {
//                     success: false,
//                     data: "Payment has already been done"
//                 }
//             }
//         }
//
//         let stripePayment = await stripe.charges.create({
//             amount: amount,
//             source: stripeTokenId,
//             currency: 'dzd'
//         })
//
//         if(stripePayment.status === "succeeded"){
//             // Real amount is known at the end of the trajectory
//             await createPayment(stripePayment.id, amount, 1)
//             return {
//                 code: 200,
//                 data: {
//                     success: true,
//                     data: "Checkout has been done successfully"
//                 }
//             }
//         }
//         else if (stripePayment.status === "failed"){
//             return {
//                 code: 200,
//                 data: {
//                     success: false,
//                     data: "Checkout failed"
//                 }
//             }
//         }
//         return {
//             code: 200,
//             data: {
//                 success: true,
//                 data: "Checkout is pending"
//             }
//         }
//     }catch (e) {
//         console.log(e)
//         return {
//             code: 500,
//             data: `Server error while performing checkout`,
//             log: `Server error while performing checkout`
//         }
//     }
// }

/**
 * Registers a local image for the checkout that links to reservation
 */
const createPayment = async (reservation_id, amount) => {
    try {
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
        await prisma.Paiment.create({
            data: {
                reservation_id: reservation_id,
                estimated_price: amount,
            }
        })
        return {
            code: 200,
            data: {
                success: true,
                data: `Payment done`
            }
        }
    }catch (e) {
        return {
            code: 500,
            data: `Payment cannot be performed`
        }
    }
}

/**
 * Returns the payment associated to a reservation
 * @param {[Int]} reservation_id
 * @return {[]} payment object of that reservation
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

const update = async (reservation_id) => {
    try {
        let payment = await prisma.Paiment.findFirst({
            where: {
                reservation_id: reservation_id
            }
        })
        if (payment){
            let real_price=  await estimationService.calculateRealPrice(reservation_id)
            await setPaymentRealPrice(payment.paiment_id, real_price)
            return true
        }
    }catch (e){
        throw Error(e.message)
    }
}

const setPaymentRealPrice = async (payment_id, price) => {
    try {
        let payment = await prisma.Paiment.update({
            where: {
                paiment_id: payment_id
            },
            data: {
                real_price: price
            }
        })
        return true
    }catch (e) {
        throw Error(`Could not update price of payment ${payment_id}`)
    }
}

module.exports = {
    getPaymentOfReservation,
    getPaymentById,
    // checkout,
    createPayment,
    update
}