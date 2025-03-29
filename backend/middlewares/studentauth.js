require("dotenv").config();

const  jwt_pass =process.env.jwt_pass
const jwt = require("jsonwebtoken");

function studentauth(req, res, next) {
    const headers = req.headers["authorization"];
    try {
        const result = jwt.verify(headers, jwt_pass);
        if (result) {
            console.log(result);
            req.studentId = result.id;
            console.log(req.studenId);
            next();
        } else {
            res.status(401).json({message: "User not signed in"});
        }
    } catch (error) {
        res.status(401).json({message: "Invalid token"});
    }
}

module.exports = studentauth;