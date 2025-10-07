const mongoose = require('mongoose');
const validator = require('validator');
const PhotoSchema = require('./photos');
const DevProfileSchema = require('./devProfile');

const userSchema = new mongoose.Schema({
    //Auth information
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
        validate: (value) => {
            return validator.isEmail(value);
        }
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    //Public profile information
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "First name must be at least 5 characters long"],
        maxlength: [50, "First name must be less than 50 characters long"],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Last name must be at least 5 characters long"],
        maxlength: [50, "Last name must be less than 50 characters long"],
    },
    birthDate: {
        type: Date, 
        validate: (value) => {
            return validator.isDate(value);
        },
        default: null
    },
    gender:{
        type: String,
        enum: ["male", "female", "Others"],
        default: null
    },
    bio: {
        type: String, 
        maxlength: [500, "Bio must be less than 500 characters long"],
        default: "No bio yet"
    },
    photos: {
        type: [PhotoSchema],
        default: []
    },
    //Dev profile information
    dev: {
        type: DevProfileSchema,
        default: null,
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;