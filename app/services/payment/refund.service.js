const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
let stripe = require("stripe")(stripeSecretKey)
const PrismaClient = require("@prisma/client").PrismaClient;
const paymentService = require("payment.service");

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

const refund = async (payment_id, amount) => {
    const isRefundable = await checkRefundable(payment_id)
    if (isRefundable){
        const r =  await stripe.refunds.create({
            charge: payment_id,
            amount: amount
        })

        await registerLocalRefund(payment_id, r)
        return r;
    }
}

module.exports = {
    refund,
    getRefundablePayments
}



