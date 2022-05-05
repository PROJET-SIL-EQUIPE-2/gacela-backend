const PrismaClient = require("@prisma/client").PrismaClient;
const paymentService = require("../../services/payment.service") ;

const prisma = new PrismaClient();

const payment = (req , res) => {
    paymentService.payment(req, res) ; 

}