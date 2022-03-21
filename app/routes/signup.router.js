const router = require("express").Router();
const signUpController = require("../controllers/signup.controller");

// const PrismaClient = require("@prisma/client").PrismaClient;
//
// const prisma = new PrismaClient();

router.post("/locataire", signUpController.signUpLocataire);

router.post("/agent", signUpController.signUpAM);


// router.get("/locataire", async (req, res) => {
//     const r = await prisma.locataires.findMany();
//     res.json(r);
// })
//
// router.get("/agents", async (req, res) => {
//     const r = await prisma.AgentsMaintenance.findMany();
//     res.json(r);
// })

module.exports = router;