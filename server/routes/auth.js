const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function makeToken(user) {
  return jwt.sign(
    { id: user._id.toString(), name: user.name, email: user.email },
    process.env.JWT_SECRET || "local-development-secret-change-me",
    { expiresIn: "7d" }
  );
}

router.post("/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || password.length < 6) {
      return res.status(400).json({
        message: "Enter your name, email, and a password of at least 6 characters."
      });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Could not create account. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    res.json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Could not log in. Please try again." });
  }
});
module.exports = router;
