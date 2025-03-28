const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);

    const { email, name } = googleRes.data;

    // Generate JWT token
    const userToken = jwt.sign({ email, name }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token: userToken, role: "student" });
  } catch (error) {
    res.status(400).json({ msg: "Invalid Google token" });
  }
});

module.exports = router;
