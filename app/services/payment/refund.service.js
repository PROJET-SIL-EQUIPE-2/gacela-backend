const stripeSecretKey = process.env.STRIPE_SECRET_KEY
let stripe = require("stripe")(stripeSecretKey)
const PrismaClient = require("@prisma/client").PrismaClient;
const paymentService = require("./payment.service");
const reservationService = require("../../services/reservations/reservation.service")

const prisma = new PrismaClient();

const getRefundablePayments = () => {

}

const checkRefundable = async (payment) => {
    return payment.estimated_price > payment.real_price
}

const registerLocalRefund = async (payment, refund) => {
    try {
        await prisma.Refund.create({
            data: {
                refund_id: refund.id,
                paiment_id: payment.payment_id,
                amount: refund.amount
            }
        })
        return true
    }catch (e) {

    }
}

const calcRefundAmount = async (payment) => {
    return payment.estimated_price - payment.real_price
}

const refund = async (reservation_id) => {
    let exists = await reservationService.exists(reservation_id)
    if (exists){
        let isFinished = await reservationService.isFinished(reservation_id)
        if (isFinished){
            // get payment id of that reservation
            let payment = await paymentService.getPaymentOfReservation(reservation_id)
            console.log(payment)
            if (payment){
                const isRefundable = await checkRefundable(payment)
                if (isRefundable){
                    let refund_amount = await calcRefundAmount(payment)
                    console.log(payment)
                    try {
                        const r =  await stripe.refunds.create({
                            charge: payment.paiment_id,
                            amount: refund_amount
                        })
                        await registerLocalRefund(payment, r)
                        return {
                            code: 200,
                            data: {
                                success: true,
                                data: r
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


                }else{
                    // Payment is not refundable
                    return {
                        code: 400,
                        data: {
                            success: false,
                            data: "Payment is not refundable"
                        }
                    }
                }
            }else{
                // No payment was found
                return {
                    code: 400,
                    data: {
                        success: false,
                        data: `No payment of that reservation was found`
                    }
                }
            }

        }else {
            // Reservation not finished yet

            return {
                code: 400,
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
            code: 400,
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



