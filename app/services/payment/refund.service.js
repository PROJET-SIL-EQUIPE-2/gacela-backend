const stripeSecretKey = process.env.STRIPE_SECRET_KEY
let stripe = require("stripe")(stripeSecretKey)
const PrismaClient = require("@prisma/client").PrismaClient;
const paymentService = require("./payment.service");
const reservationService = require("../../services/reservations/reservation.service")

const prisma = new PrismaClient();

const getRefundablePayments = () => {

}

const checkRefundable = async (payment_id) => {
    try {
        let payment = await paymentService.getPaymentById(payment_id)
        let facturation = await prisma.Facture.findUnique({
            where: {
                facturation_id: payment.paiment_id
            },
        })
        return facturation.estimated_price > facturation.real_price

    }catch (e) {

    }
}

const registerLocalRefund = async (payment_id, refund) => {
    try {
        await prisma.Refund.create({
            data: {
                refund_id: refund.id,
                paiment_id: payment_id,
                amount: refund.amount
            }
        })
        return true
    }catch (e) {

    }
}

const calcRefundAmount = async (payment_id) => {
    try {
        let payment = await paymentService.getPaymentById(payment_id)
        let facturation = await prisma.Facture.findUnique({
            where: {
                facturation_id: payment.paiment_id
            },
        })
        return facturation.estimated_price - facturation.real_price

    }catch (e) {
        return 0
    }
}

const refund = async (reservation_id) => {
    let exists = await reservationService.exists(reservation_id)
    if (exists){
        let isFinished = await reservationService.isFinished(reservation_id)
        if (isFinished){
            // get payment id of that reservation
            let payment = paymentService.getPaymentOfReservation(reservation_id)
            if (payment){
                let payment_id = payment.paiment_id
                const isRefundable = await checkRefundable(payment_id)
                if (isRefundable){
                    let refund_amount = await calcRefundAmount(payment_id)
                    const r =  await stripe.refunds.create({
                        charge: payment_id,
                        amount: refund_amount
                    })

                    await registerLocalRefund(payment_id, r)
                    return {
                        code: 200,
                        data: {
                            success: true,
                            data: r
                        }
                    }
                }else{
                    // Payment is not refundable
                    return {
                        code: 401,
                        data: {
                            success: false,
                            data: "Payment is not refundable"
                        }
                    }
                }
            }else{
                // No payment was found
                return {
                    code: 401,
                    data: {
                        success: false,
                        data: `No payment of that id was found`
                    }
                }
            }

        }else {
            // Reservation not finished yet

            return {
                code: 401,
                data: {
                    success: false,
                    data: "Reservation is not finished yet"
                }
            }
        }

    }else{
        console.log("hi")
        // No reservation of that id
        return {
            code: 401,
            data: {
                success: false,
                data: "No reservation of that id was found"
            }
        }
    }

}

module.exports = {
    refund,
    getRefundablePayments
}



