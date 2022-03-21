const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const authRouter = require("./routes/auth.router")
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mobileLoginRouter = require("./routes/mobileLogin.router");
const passwordResetRouter = require("./routes/passwordReset.router");
const signUpRouter = require("./routes/signup.router");
const passwordResetRouterWeb = require("./routes/passwordResetWeb.route")


// Configure dotenv
dotenv.config({
    path: ".env"
})

const app = express()
app.set("port", process.env.PORT || 3000) ;

//// Apply middlewares
// Allow cross-origin
app.use(cors())

// Parse data as json
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//// Apply routers
app.use('/api/')
app.use(authRouter);
app.use('/api/mobile_passwordReset',passwordResetRouter);
app.use('/api/web_passwordReset',passwordResetRouterWeb);

app.use("/api/mobile_login", mobileLoginRouter);
app.use("/api/signup", signUpRouter);


app.listen(app.get("port"), () => {
    console.log(`App is served under ${app.get("port")} port`);
})