// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const connectDB = require('./config/connectDB');
const User = require('./model/user');
const { validateSignUp } = require('./utils/validateSignUp');

// Initialize Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

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
app.post("/api/v1/auth/register", validateSignUp, async (req, res) => {
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
})

/**
 * Database connection and server startup
 * 
 * @description
 * Establishes connection to MongoDB database and starts the Express server.
 * If database connection fails, the process exits with code 1.
 * Server runs on port 3000 by default.
 */
connectDB().then(() => {
    console.log('Database connection successful');
    // Start the Express server on port 3000
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    // Log database connection error and exit process
    console.log(err);
    process.exit(1);
});

// Export the Express app for testing purposes
module.exports = app;