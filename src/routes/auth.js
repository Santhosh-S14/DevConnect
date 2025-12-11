const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { JWT_SECRET_KEY } = require('../config/constants');
const { validateSignUp, validateLogin } = require('../utils/validateSignUp');

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
    const accessTokenOptions = {
        httpOnly: true,
        maxAge: 2 * 60 * 1000
    }
    try {
        const user = await User.findOne({
            email: email
        }).select("+passwordHash");

        if (!user) {
            res.status(401).json({
                code: "AUTHENTICATION_ERROR",
                message: "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (isPasswordCorrect) {
            const userObj = user.toObject();
            delete userObj.passwordHash;
            const accessToken = jwt.sign({ _id: user._id }, JWT_SECRET_KEY);
            res.cookie("access_token", accessToken, accessTokenOptions);
            res.status(200).json({
                code: "SUCCESS",
                message: "Login successful",
                userObj
            })
        }
        else {
            res.status(401).json({
                code: "AUTHENTICATION_ERROR",
                message: "Invalid email or password"
            })
        }
    }
    catch (error) {
        res.status(500).json({
            code: "SERVER_ERROR",
            message: "Internal Server Error"
        });
    }
});

router.post("/logout", async (req, res) => {
    res.cookie("access_token", null);
    res.status(200).json({
        code: "SUCCESS",
        message: "Logout successful"
    });
});

module.exports = router;

