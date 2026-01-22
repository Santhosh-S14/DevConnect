const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config/constants");
const User = require("../model/user");


const userAuth = async (req, res, next) => {
    const token = req.cookies?.access_token;
    if (!token) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Authentication required"
        })
    }
    try {
        const payload = await jwt.verify(token, JWT_SECRET_KEY);
        const loggedInUser = await User.findById({
            _id: payload._id,
        })
        if (!loggedInUser) {
            return res.status(401).json({
                code: "UNAUTHORIZED",
                message: "User not found!!"
            })
        }
        req.user = loggedInUser;
        next();
    }
    catch (error) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Invalid or expired token"
        })
    }
}

module.exports = { userAuth }