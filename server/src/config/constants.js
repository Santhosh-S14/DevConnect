/**
 * Application Constants Configuration
 * 
 * @description
 * Centralizes application configuration constants by reading from environment variables.
 * This file serves as a single source of truth for configuration values used throughout the application.
 * Environment variables are loaded from the .env file using dotenv package.
 * 
 * @constant {string} MONGODB_URI - MongoDB connection string from environment variables
 * 
 * @example
 * // Usage in other files:
 * const { MONGODB_URI } = require('./config/constants');
 * 
 * @requires dotenv - Must be configured in the main application file to load .env variables
 */
module.exports = {
    MONGODB_URI: process.env.MONGODB_URI, // MongoDB connection string from environment variables
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
    ACCESS_TOKEN_TTL_MIN: process.env.ACCESS_TOKEN_TTL_MIN,
    REFRESH_TOKEN_TTL_DAYS: process.env.REFRESH_TOKEN_TTL_DAYS,
    NODE_ENV: process.env.NODE_ENV,
}
