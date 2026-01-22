// Import required dependencies
const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Developer Profile Schema - Embedded schema for developer-specific information
 * 
 * @description
 * Defines the structure for developer profile data that can be embedded in user documents.
 * Contains professional information relevant to developers including role, experience, skills, and social links.
 * This schema is embedded within the User schema and does not create a separate collection.
 * 
 * @schema
 * - role: Developer's job title or role
 * - yearsOfExperience: Number of years in development (0-50)
 * - skills: Array of technical skills
 * - linkedIn: LinkedIn profile URL (validated)
 * - github: GitHub profile URL (validated)
 * - _id: false - Prevents automatic _id generation for embedded documents
 */
const devProfileSchema = new mongoose.Schema({
    role: {
        type: String,
        trim: true, // Removes leading/trailing whitespace
    },
    yearsOfExperience: {
        type: Number,
        min: 0, // Minimum years of experience
        max: 50 // Maximum years of experience (reasonable upper limit)
    },
    skills: {
        type: [String], // Array of skill strings
        trim: true // Trims whitespace from each skill string
    },
    linkedIn: {
        type: String,
        trim: true, // Removes leading/trailing whitespace
        validate: (value) => {
            // Custom validator to ensure valid URL format
            return validator.isURL(value);
        }
    },
    github: {
        type: String,
        trim: true, // Removes leading/trailing whitespace
        validate: (value) => {
            // Custom validator to ensure valid URL format
            return validator.isURL(value);
        }
    }
}, {
    _id: false, // Prevents automatic _id generation for embedded documents
});

/**
 * Export the developer profile schema
 * 
 * @description
 * Exports the devProfileSchema to be used as an embedded schema in the User model.
 * This schema is not used to create a separate collection but is embedded within user documents.
 */
module.exports = devProfileSchema;