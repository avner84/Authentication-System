const express = require('express');
const router = express.Router();

const authRoutes = require("./auth");
const userRoutes = require("./user");

console.log('Setting up /auth and /user routes');
router.use("/auth", authRoutes);
router.use("/user", userRoutes);


module.exports = router;
