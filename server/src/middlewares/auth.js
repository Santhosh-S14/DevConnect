const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require("../config/constants");
const User = require("../model/user");
const { verifyAccessToken } = require('../utils/tokens');


const userAuth = async (req, res, next) => {
    const token = req.cookies?.access_token;
    if (!token) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Authentication required"
        })
    }
    try {
        const payload = verifyAccessToken(token);
        const loggedInUser = await User.findById(payload.sub).select()
        if (!loggedInUser) {
            return res.status(401).json({
                code: "UNAUTHORIZED",
                message: "User not found!!"
            })
        }
        req.user = loggedInUser;
        req.sessionId = payload.sid;
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