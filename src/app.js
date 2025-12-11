// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

// Initialize Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

// Route handlers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

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