const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require("crypto")
const User = require('../model/user');
const Session = require("../model/session");
const { validateSignUp, validateLogin } = require('../utils/validate');
const { signAccessToken, signRefreshToken, verifyRefreshToken, refreshTtlDays } = require("../utils/tokens");
const { hashToken } = require("../utils/sessionCrypto");
const { setAuthCookies, clearAuthCookies } = require("../utils/cookies");
const { userAuth } = require('../middlewares/auth');
const { ref } = require('process');

const router = express.Router();

/**
 * POST /api/v1/auth/register - User registration endpoint
 * 
 * @description
 * Creates a new user account with validated email, password, first name, and last name.
 * Password is hashed using bcrypt before storing in the database.
 * Uses validateSignUp middleware to ensure data validation before processing.
 * 
 * @middleware validateSignUp - Validates and sanitizes request body data
 * 
 * @param {Object} req.body - Request body containing user registration data
 * @param {string} req.body.email - User's email address (validated and lowercased)
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {string} req.body.firstName - User's first name (validated and trimmed)
 * @param {string} req.body.lastName - User's last name (validated and trimmed)
 * 
 * @returns {Object} JSON response with success message and user data, or error message
 * @returns {number} 201 - User created successfully
 * @returns {number} 500 - Internal server error
 */
router.post("/register", validateSignUp, async (req, res) => {
    // Extract validated user data from request body
    const { email, password, firstName, lastName } = req.body;

    try {
        // Hash the password with bcrypt using salt rounds of 10
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user instance with hashed password
        const user = new User({
            email,
            passwordHash,
            firstName,
            lastName,
        });

        // Save user to database
        await user.save();

        // Return success response with user data
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        // Handle any errors during user creation (e.g., duplicate email)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post("/login", validateLogin, async (req, res) => {
    const { email, password } = req.body;
    const deviceId = req.headers["x-device-id"] || crypto.randomUUID();
    try {
        const user = await User.findOne({
            email: email
        }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({
                code: "AUTHENTICATION_ERROR",
                message: "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                code: "AUTHENTICATION_ERROR",
                message: "Invalid email or password"
            })
        }

        const userObj = user.toObject()
        delete userObj.passwordHash;

        const expiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

        const tempSession = await Session.create({
            userId: user._id,
            deviceId,
            userAgent: req.get("user-agent"),
            ip: req.ip,
            refreshTokenHash: "temp",
            expiresAt,
        });

        const jti = crypto.randomUUID();
        const refreshToken = signRefreshToken({ userId: user._id, sessionId: tempSession._id, jti });
        const accessToken = signAccessToken({ userId: user._id, sessionId: tempSession._id });

        tempSession.refreshTokenHash = hashToken(refreshToken);
        await tempSession.save();

        setAuthCookies(res, accessToken, refreshToken);
        return res.status(200).json({
            code: "SUCCESS",
            message: "Login successful",
            userObj,
            deviceId,
        });
    }
    catch (error) {
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "Internal Server Error",
            error: error
        });
    }
});

router.post("/refresh", async (req, res) => {
    const token = req.cookies?.refresh_token;
    if (!token) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Authentication required"
        })
    }
    try {
        const payload = verifyRefreshToken(token);
        const session = await Session.findById(payload.sid);
        if (!session) {
            clearAuthCookies(res);
            return res.status(401).json({
                code: "UNAUTHORIZED",
                message: "This session is not valid. Please sign in again"
            });
        }

        if (session.refreshTokenHash !== hashToken(token)) {
            session.revokedAt = new Date();
            await session.save();
            clearAuthCookies(res);
            return res.status(401).json({
                code: "UNAUTHORIZED", message: "Session invalid"
            });
        }

        const newJti = crypto.randomUUID();
        const newRefreshToken = signRefreshToken({ userId: payload.sub, sessionId: session._id, jti: newJti });
        const newAccessToken = signAccessToken({ userId: payload.sub, sessionId: session._id });

        const newRefreshTokenHash = hashToken(newRefreshToken);
        session.refreshTokenHash = newRefreshTokenHash;
        session.ip = req.ip;
        session.userAgent = req.get("user-agent");
        await session.save();

        setAuthCookies(res, newAccessToken, newRefreshToken);
        res.status(200).json({
            code: "SUCCESS",
            message: "Refreshed"
        })
    }
    catch (error) {
        clearAuthCookies(res);
        res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Invalid refresh token",
            error: error
        })
    }
})

router.post("/logout", async (req, res) => {
    if (req.sessionId) {
        await Session.findByIdAndDelete(req.sessionId);
    }
    clearAuthCookies(res);
    res.status(200).json({
        code: "SUCCESS",
        message: "Logout successful"
    });
});

router.get("/sessions", userAuth, async (req, res) => {
    const sessions = await Session.find({
        userId: req.user._id,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
    })
        .sort({ updatedAt: -1 })
        .select("_id userId deviceId userAgent ip createdAt updatedAt expiresAt");

    return res.status(200).json({ code: "SUCCESS", sessions });
});

module.exports = router;

