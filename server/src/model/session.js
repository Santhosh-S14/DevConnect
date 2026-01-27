const { default: mongoose, Schema } = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    refreshTokenHash: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true,
        index: true,
    },
    userAgent: {
        type: String
    },
    ip: { type: String },
    revokedAt: { type: Date },
    expiresAt: { type: Date, required: true },
},
    { timestamps: true }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;