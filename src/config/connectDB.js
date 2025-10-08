// Import required dependencies
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./constants');

/**
 * Database connection function
 * 
 * @description
 * Establishes a connection to the MongoDB database using the URI from environment variables.
 * If the connection fails, logs the error and exits the process with code 1.
 * This function is called during application startup to ensure database connectivity.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is established or rejects on error
 * 
 * @throws {Error} If database connection fails, the process exits with code 1
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connection established successfully');
    } catch (error) {
        // Log connection error and exit process if database connection fails
        console.log('MongoDB connection failed:', error);
        process.exit(1); // Exit with code 1 to indicate failure
    }
}

/**
 * Export the database connection function
 * 
 * @description
 * Exports the connectDB function to be used in the main application file for establishing database connectivity.
 */
module.exports = connectDB;