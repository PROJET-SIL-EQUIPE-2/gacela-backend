const jwt = require("jsonwebtoken")

// 1. Generating Token
function generateAccessToken(username){
    return jwt.sign(username, process.env.SECRET);
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
function authStudent(req, resp) {
    resp.status(200).json({"message": "hello"});
}


module.exports = {
    authStudent
}