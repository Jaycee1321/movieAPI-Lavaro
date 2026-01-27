const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require("../auth");

// Register user
module.exports.registerUser = (req, res) => {

    // Email validation
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }

    // Password validation
    if (req.body.password.length < 8) {
        return res.status(400).send({ message: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(409).send({ message: "User already exists" });
            }

            // Create new user
            const newUser = new User({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                isAdmin: req.body.isAdmin || false
            });

            return newUser.save()
                .then(() => {
                    return res.status(201).send({ message: "Registered successfully" });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({
                message: "Server error. Please contact administrator."
            });
        });
};

// Login user
module.exports.loginUser = (req, res) => {

    // Email validation
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }

    User.findOne({ email: req.body.email })
        .then(user => {

            if (!user) {
                return res.status(404).send({ message: "User does not exist" });
            }

            const isPasswordCorrect = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!isPasswordCorrect) {
                return res.status(401).send({ message: "Incorrect password" });
            }

            // Success
            return res.status(200).send({
              access: auth.createAccessToken(user),
              user: {
                email: user.email,
                isAdmin: user.isAdmin
              },
              message: "Login successful"
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({
                message: "Server error. Please contact administrator."
            });
        });
};
