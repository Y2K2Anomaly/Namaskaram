const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {

    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = await new User({
            name: req.body.name,
            username: req.body.username,
            desc: req.body.desc,
            city: req.body.city,
            from: req.body.from,
            dateOfBirth: req.body.dateOfBirth,
            relationship: req.body.relationship,
            profilePicture: req.body.profilePicture,
            email: req.body.email,
            password: hashedPassword,
        })

        // save new user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
});

// LOGIN
router.post("/login", async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Wrong password!' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error during login:', err); // Log the error for debugging purposes
        res.status(500).json({ error: 'Something went wrong on the server.' });
    }
});


module.exports = router;