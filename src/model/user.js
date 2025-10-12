// Import required dependencies
const mongoose = require('mongoose');
const validator = require('validator');
const PhotoSchema = require('./photos');
const DevProfileSchema = require('./devProfile');

/**
 * User Schema - Main user model for the DevConnect application
 * 
 * @description
 * Defines the structure for user documents in MongoDB.
 * Includes authentication information, public profile data, and developer profile.
 * Uses embedded schemas for photos and developer profile information.
 * 
 * @schema
 * - Authentication: email (unique, indexed), passwordHash (excluded from queries)
 * - Profile: firstName, lastName, birthDate, gender, bio
 * - Photos: Array of photo objects with URL and primary photo flag
 * - Developer Profile: Optional embedded developer information
 * - Timestamps: Automatically adds createdAt and updatedAt fields
 */
const userSchema = new mongoose.Schema({
    // Authentication information
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensures no duplicate emails in the database
        lowercase: true, // Converts email to lowercase for consistency
        index: true, // Creates database index for faster email lookups
        validate: (value) => {
            // Custom validator to ensure email format is valid
            return validator.isEmail(value);
        }
    },
    passwordHash: {
        type: String,
        required: true,
        select: false, // Excludes password hash from queries by default for security
    },
    // Public profile information
    firstName: {
        type: String,
        required: true,
        trim: true, // Removes leading/trailing whitespace
        minlength: [5, "First name must be at least 5 characters long"],
        maxlength: [50, "First name must be less than 50 characters long"],
    },
    lastName: {
        type: String,
        required: true,
        trim: true, // Removes leading/trailing whitespace
        minlength: [5, "Last name must be at least 5 characters long"],
        maxlength: [50, "Last name must be less than 50 characters long"],
    },
    birthDate: {
        type: Date,
        validate: (value) => {
            // Custom validator to ensure valid date format
            return validator.isDate(value);
        }
    },
    gender: {
        type: String,
        enum: ["male", "female", "Others"], // Restricts values to predefined options
        default: null // Optional field, defaults to null
    },
    bio: {
        type: String,
        maxlength: [500, "Bio must be less than 500 characters long"],
        default: "No bio yet" // Default bio text for new users
    },
    photos: {
        type: [PhotoSchema], // Array of photo objects using embedded PhotoSchema
        default: [] // Empty array by default
    },
    // Developer profile information
    dev: {
        type: DevProfileSchema, // Embedded developer profile using DevProfileSchema
        default: null, // Optional field, defaults to null
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
        transform: (_doc, ret) => {
          delete ret.passwordHash; // remove sensitive field
          return ret;
        }
      }
});

/**
 * Create and export the User model
 * 
 * @description
 * Creates a Mongoose model from the userSchema and exports it for use in other parts of the application.
 * The model provides methods for database operations like save(), find(), findOne(), etc.
 */
const User = mongoose.model('User', userSchema);
module.exports = User;