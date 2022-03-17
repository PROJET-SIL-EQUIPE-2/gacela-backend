
function authStudent(req, resp) {
    resp.status(200).json({"message": "hello"});
}


module.exports = {
    authStudent
}