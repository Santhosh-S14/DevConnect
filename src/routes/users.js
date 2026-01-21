const express = require('express');
const bcrypt = require("bcrypt");
const { userAuth } = require('../middlewares/auth');
const { validateUpdateUser, validateChangePassword } = require('../utils/validate');
const User = require('../model/user');
const Interactions = require('../model/interaction');
const Match = require('../model/match');

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

router.get("/me/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const interactions = await Interactions.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName gender bio dev photos");

        return res.status(200).json({
            code: "SUCCESS",
            connectionsReceived: interactions.map(v => v.fromUserId),
        })
    }
    catch (error) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            messsage: "Internal Server Error " + error
        })
    }
});

router.get("/me/connections", userAuth, async (req, res) => {
    const loggedInUser = req.user;

    const matches = await Match.find({
        participants: loggedInUser._id,
        active: true,
    }).populate("participants", "firstName lastName gender bio dev photos ")

    return res.status(200).json({
        code: "SUCCESS",
        matches: matches.map(v =>
            v.participants.filter(
                p => p._id.toString() !== loggedInUser._id.toString()
            )
        )
    })
})

router.get("/discover", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const interactions = await Interactions.find({
            fromUserId: loggedInUser._id
        }).select("toUserId");

        const usersToHide = new Set();
        interactions.forEach((req) => {
            usersToHide.add(req.toUserId);
        });

        const usersToShow = await User.find({
            $and: [
                { _id: { $nin: Array.from(usersToHide) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName gender bio dev photos")

        res.status(200).json({
            code: "SUCCESS",
            feed: usersToShow
        })
    }
    catch (error) {
        return res.status(500).json({
            code: "SERVER_ERROR",
            message: "Internal Server Error " + error
        })
    }
})

module.exports = router;

