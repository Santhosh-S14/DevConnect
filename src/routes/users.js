const express = require('express');
const bcrypt = require("bcrypt");
const { userAuth } = require('../middlewares/auth');
const { validateUpdateUser, validateChangePassword } = require('../utils/validate');
const User = require('../model/user');

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
});

router.patch("/me/password", userAuth, validateChangePassword, async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    try {
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                code: "BAD_REQUEST",
                message: "New password and confirm password do not match"
            });
        }
        const user = await User.findById(req.user._id).select("+passwordHash");
        if (!user) {
            return res.status(401).json({
                code: "AUTHENTICATION_ERROR",
                message: "Invalid email or password"
            });
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordCorrect) {
            res.status(401).json({
                code: "AUTHENTICATION_ERROR",
                message: "Current password is not correct"
            });
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.passwordHash = newPasswordHash;
        await user.save();
        res.cookie("access_token", null);
        res.status(200).json({
            code: "SUCCESS",
            message: "Password updated successfully. Please log in again",
        });
    }
    catch (error) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            message: "Internal Server Error"
        })
    }
})

module.exports = router;

