// Import required dependencies
const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Photo Schema - Embedded schema for user photos
 * 
 * @description
 * Defines the structure for photo objects that can be embedded in user documents.
 * Contains photo URL and a flag to indicate if it's the primary profile photo.
 * This schema is embedded within the User schema and does not create a separate collection.
 * 
 * @schema
 * - url: Photo URL (validated as proper URL format)
 * - isPrimary: Boolean flag indicating if this is the user's primary profile photo
 * - _id: false - Prevents automatic _id generation for embedded documents
 */
const photoSchema = new mongoose.Schema({
    url: {
        type: String,
        trim: true, // Removes leading/trailing whitespace
        validate: (value) => {
            // Custom validator to ensure valid URL format
            return validator.isURL(value);
        }
    },
    isPrimary: {
        type: Boolean,
        default: false, // Default to false, only one photo should be primary
    }
}, {
    _id: false, // Prevents automatic _id generation for embedded documents
});

/**
 * Export the photo schema
 * 
 * @description
 * Exports the photoSchema to be used as an embedded schema in the User model.
 * This schema is not used to create a separate collection but is embedded within user documents.
 */
module.exports = photoSchema;