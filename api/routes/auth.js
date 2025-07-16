const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Username or email already exists
 *       500:
 *         description: Registration failed
 *
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns user and accessToken
 *       401:
 *         description: Wrong credentials
 *       500:
 *         description: Server error
 */

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!process.env.PASS_SEC) {
      throw new Error("Encryption key not provided. Check your environment variables.");
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
    const newUser = new User({ username, email, password: encryptedPassword });
    const savedUser = await newUser.save();
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      createdAt: savedUser.createdAt,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message && err.message.includes("Duplicate field value")) {
      return res.status(409).json({ error: "Username or email already exists." });
    }
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Registration failed." });
    }
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json("Wrong credentials!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const decryptedPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      return res.status(401).json("Wrong credentials!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
