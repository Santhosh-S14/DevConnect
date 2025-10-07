const mongoose = require('mongoose');
const validator = require('validator');

const devProfileSchema = new mongoose.Schema({
    role: {
        type: String,
        trim: true,
    },
    yearsOfExperience: {
        type: Number,
        min: 0,
        max: 50
    },
    skills:{
        type: [String],
        trim: true
    },
    linkedIn: {
        type: String,
        trim: true,
        validate: (value) => {
            return validator.isURL(value);
        }
    },
    github: {
        type: String,
        trim: true,
        validate: (value) => {
            return validator.isURL(value);
        }
    }
}, {
    _id: false,
});

module.exports = devProfileSchema;