/*
* An example demonstrating the use of prisma
* */

const joi = require("joi")
const prismaPkg = require("@prisma/client")

// Create express router
const router = require("express").Router();

// Prisma client object
const {PrismaClient} = prismaPkg;
const prisma = new PrismaClient();

router.get("/api/students/", async(req, resp) => {
    let result = await prisma.student.findMany();

    resp.json(result);
})

module.exports = router;