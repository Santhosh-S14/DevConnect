require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const connectDB = require('./config/connectDB');
const User = require('./model/user');
const app = express();

app.use(express.json());

app.post("/api/v1/auth/register", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            email, 
            passwordHash, 
            firstName, 
            lastName,
        });
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

connectDB().then(() => {
    console.log('Database connection successful');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log(err);
});

module.exports = app;