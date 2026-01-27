const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require("../auth");

// Register User
module.exports.registerUser = (req, res) => {
  const { email, password, isAdmin = false } = req.body;

  // Check email format
  if (!email.includes("@")) return res.status(400).send(false);

  // Check password length
  if (password.length < 8) return res.status(400).send(false);

  // Create new user
  const newUser = new User({
    email,
    password: bcrypt.hashSync(password, 10),
    isAdmin
  });

  newUser.save()
    .then(() => {
      res.status(201).send({ message: "Registered successfully" });
    })
    .catch(error => errorHandler(error, req, res));
};

// Login User
module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email.includes("@")) return res.status(400).send(false);

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404).send(false);

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (isPasswordCorrect) {
        return res.status(200).send({
          access: auth.createAccessToken(user),
        });
      } else {
        return res.status(401).send(false);
      }
    })
    .catch(error => errorHandler(error, req, res));
};