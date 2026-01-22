const express = require('express');
const Interactions = require('../model/interaction');
const { userAuth } = require('../middlewares/auth');
const User = require('../model/user');
const { validateInteraction } = require('../utils/validate');
const Match = require('../model/match');

const router = express.Router();

router.post("/", userAuth, validateInteraction, async (req, res) => {
    try {
        const { toUserId, status } = req.body;
        const fromUserId = req.user._id;

        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({
                code: "BAD_REQUEST",
                message: "Cannot send connection request to yourself"
            })
        }
        const toUser = await User.findById({ _id: toUserId });
        if (!toUser) {
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "User not found"
            });
        }
        const existingInteraction = await Interactions.findOneAndUpdate(
            { fromUserId, toUserId },
            { $set: { status } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        let matched = false;

        if (status == "interested") {
            const reverse = await Interactions.findOne({
                fromUserId: toUserId,
                toUserId: fromUserId,
                status: "interested"
            }).select('_id');

            matched = !!reverse;
            if (matched) {
                const pairKey = Match.makePairKey(fromUserId, toUserId);

                const match = await Match.findOneAndUpdate(
                    { pairKey },
                    {
                        participants: [fromUserId, toUserId],
                        active: true,
                    },
                    { upsert: true, new: true }
                )
            }
        }
        return res.status(200).json({
            message: "Interaction recorded",
            toUserId,
            status,
            matched,
            interactionId: existingInteraction._id
        });
    }
    catch (err) {
        return next(err);
    }
})

module.exports = router;