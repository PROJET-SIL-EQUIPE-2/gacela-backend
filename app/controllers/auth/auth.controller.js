const jwt = require("jsonwebtoken")
const {func} = require("joi");
const { PrismaClient } = require('@prisma/client')
const bcrypt= require("bcrypt")
const prisma = new PrismaClient()
const Role = require('../../middlewares/auth/roles');

// 1. Generating Token
function generateAccessToken(username, role){
    return jwt.sign({username, role}, process.env.SECRET);
}
// 2. Authenticating Token
function authenticate(req, res, next){
    const authHeaders = req.headers["Authorization"]
    const token = authHeaders && authHeaders.split(" ")[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user

        next()
    })
}

const authAdmins=(req , res, next)=>{
    const {email, password} = req.body;
    console.log("EMAIL =", email);
    let theUser = null;
        prisma.Admins.findUnique({
            where: {
                email: email,
            },
        })
        .then(user=> {
            // go search in Decideurs
            if(user==null){
                next();
                return "NEXT";
            }else{
                theUser = user;
                return bcrypt.compare(password, theUser.password)
            }
        })
        .then(status => {
            if(status!=="NEXT"){
                if (status === true) {
                    res.setHeader('Content-Types', 'application/json');
                    res.statusCode = 200;
                    //TODO: Add  admin role
                    res.json({success: true, data: {token: generateAccessToken(theUser, Role.Admin) , accountType : "Admin"}})
                }else{
                    throw new Error("Password is wrong")
                }
            }
        })
        .catch(err=>{
            res.setHeader('Content-Types', 'application/json');
            res.statusCode = err.statusCode || 500;
            res.json({success :false , data :{message : err.message}})
        })
}

const authDecideurs=(req , res, next)=>{
    const {email, password} = req.body;
    let theUser = null;
    prisma.Decideurs.findUnique({
        where: {
            email: email,
        },
    })
        .then(user=> {
            if(user==null){
               throw new Error("Email Don't exist in our database !")
            }else{
                theUser = user;
                return bcrypt.compare(password, theUser.password)
            }
        })
        .then(status => {
            if (status === true) {
                res.setHeader('Content-Types', 'application/json');
                res.statusCode = 200;
                // TODO: Add Decideur role
                res.json({success: true, data: {token: generateAccessToken(theUser, Role.Decideur) , accountType : "Decideur"}})
            }else{
                throw new Error("Password is wrong")
            }
        })
        .catch(err=>{
            console.log(err.message)
            res.setHeader('Content-Types', 'application/json');
            res.statusCode =  500;
            res.json({success :false , data :{message : err.message}})
        })
}



module.exports = {
    authAdmins,
    authDecideurs
}
