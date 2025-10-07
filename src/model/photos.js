const mongoose = require('mongoose');
const validator = require('validator');

const photoSchema = new mongoose.Schema({
    url: {
        type: String,
        trim: true,
        validate: (value) => {
            return validator.isURL(value);
        }
    },
    isPrimary: {
        type: Boolean,
        default: false,
    }
}, {
    _id: false,
});

module.exports = photoSchema;