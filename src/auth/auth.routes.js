const express = require("express");
const User = require("./auth.model");
const jwt = require("jsonwebtoken");
const app = express.Router();
const secret = process.env.SECRET_PASSWORD;

app.get("/", async (req, res) => {
  let users = await User.find();
  return res.send(users);
});

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

app.post("/signup", async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(403)
      .send({ message: "user already exists,please login" });
  }

  await User.create({
    name,
    phoneNumber,
    email,
    password,
  });

  return res.status(201).send({
    message: "user created successfully",
    name,
    phoneNumber,
    email,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(403).send({ message: "Invalid password" });
  }

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    secret,
    { expiresIn: "7 days" }
  );

  return res.send({ message: "login success", token });
});

module.exports = app;
