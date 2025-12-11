const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateUpdateUser } = require('../utils/validateSignUp');

const router = express.Router();

router.get("/me", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        res.status(200).json({
            code: "SUCCESS",
            user: loggedInUser
        })
    }
    catch (error) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Invalid or expired token"
        })
    }
});

router.patch("/me", userAuth, validateUpdateUser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.status(200).json({
            code: "SUCCESS",
            message: "User updated successfully",
            user: loggedInUser
        })
    }
    catch (error) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            message: "Internal Server Error"
        })
    }
})

module.exports = router;

