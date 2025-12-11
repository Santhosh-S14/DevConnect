const express = require('express');
const { userAuth } = require('../middlewares/auth');

const router = express.Router();

router.get("/me", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        res.status(200).json({
            code: "SUCCESS",
            user: loggedInUser
        })
    }
    catch (error) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            message: "Invalid or expired token"
        })
    }
});

module.exports = router;

