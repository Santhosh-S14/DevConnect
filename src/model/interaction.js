const { default: mongoose, Schema } = require("mongoose");

const interactionSchema = new mongoose.Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["interested", "ignored"],
            message: `{$VALUE} is not a valid status type`
        },
    }
},
    {
        timestamps: true
    });

// Compound unique index to prevent duplicate interactions between the same two users
interactionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

const Interactions = mongoose.model('Interactions', interactionSchema);
module.exports = Interactions;