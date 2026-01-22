const { default: mongoose, Schema } = require("mongoose");


const matchSchema = new mongoose.Schema({
    participants: {
        type: [
            { type: Schema.Types.ObjectId, ref: "User", required: true }
        ],
        validate: v => v.length === 2,
        index: true
    },
    pairKey: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

matchSchema.statics.makePairKey = function (userA, userB) {
    const [a, b] = [userA.toString(), userB.toString()].sort();
    return `${a}_${b}`
};

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;