const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")

const authRouter = require("./routes/auth/auth.router");
const mobileLoginRouter = require("./routes/auth/mobileLogin.router");

const passwordResetRouter = require("./routes/auth/passwordReset.router")
const signUpRouter = require("./routes/auth/signup.router");
const passwordResetRouterWeb = require("./routes/auth/passwordResetWeb.route");
const locataireRouter = require("./routes/locataire/locataire.route");
const accountsRouter = require("./routes/accounts/accounts.router");
const settingsRouter = require("./routes/settings/mobileSettings.route")
const websettingsRouter = require("./routes/settings/webSettings.route")

const webLoginRouter = require("./routes/auth/webLogin.router");

const tasksRouter = require("./routes/tasks/tasks.route")
const supportsRouter = require("./routes/supports/supports.route")

const blockAccountsRouter = require("./routes/blockAccounts/block.Router");

const vehiclesRouter = require("./routes/vehicules/vehicles.router");
const decideurRouter = require("./routes/decideurs/decideurs.router");

const agentsRouter = require("./routes/agents/agents.router");

const reservationsRouter = require("./routes/reservation/reservation.route")

const typesService = require("./routes/vehicules/types.router");

const regionsRouter = require("./routes/regions/regions.route")

// firebase admin
const firebaseAdminInitializeApp = require("./config/firebase-admin.config")

// Configure dotenv
dotenv.config({
    path: ".env"
})

const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.static('uploads'));

//// Apply middlewares
// Allow cross-origin
app.use(cors())

// Parse data as json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Gacela API is up and running")
})
//// Apply routers
app.use('/api/notification', require('./routes/locataire/notificationLoc.route'));
app.use(authRouter);
app.use('/api/mobile_passwordReset', passwordResetRouter);

app.use('/api/web_passwordReset', passwordResetRouterWeb);
app.use('/api/mobile_passwordReset', passwordResetRouter);

app.use("/api/mobile_login", mobileLoginRouter);
app.use("/api/signup", signUpRouter);
app.use("/api/web_login", webLoginRouter)

app.use("/api/locataire", locataireRouter);

app.use("/api/accounts", accountsRouter);
app.use("/api/mobile_settings", settingsRouter);
app.use("/api/web_settings", websettingsRouter);

app.use("/api/tasks", tasksRouter);
app.use("/api/supports", supportsRouter);

// TOGGLE BLOCK ACCOUNTS
app.use("/api/accounts/toggle-block", blockAccountsRouter);

app.use("/api/vehicles", vehiclesRouter);

app.use("/api/decideurs", decideurRouter);

app.use("/api/agents", agentsRouter);

app.use("/api/reservations", reservationsRouter);

app.use("/api/types", typesService);

app.use("/api/regions", regionsRouter);

const odb = require("./services/odb/odb");
const mqtt = require("mqtt");

// firebase cloud messaging
firebaseAdminInitializeApp();
app.use("/api/notifications", require("./routes/notifications/notifications.route"))

app.listen(app.get("port"), () => {
    console.log(`App is served under ${app.get("port")} port`);
})
