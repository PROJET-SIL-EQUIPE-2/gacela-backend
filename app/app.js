// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// import bodyParser from 'body-parser';
// import authRouter from 'routes/auth.router'
const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const authRouter = require("./routes/auth.router")

// Configure dotenv
dotenv.config()

const app = express()

//// Apply middlewares
// Allow cross-origin
app.use(cors())

// Parse data as json
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//// Apply routers
app.use(authRouter)


app.listen("3000", () => {
    console.log("App is served under 3000 port");
})