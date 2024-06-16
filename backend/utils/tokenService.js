const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const {JWT_SECRET} = require('../config/vars'); 
const {updateUserRefreshToken} = require('../data-access/auth')

function createToken(data, expiresIn) {
    return jwt.sign(data, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
    try {
        // Attempt to verify the token with the secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;  // Return the decoded token data if token is valid
    } catch (error) {
        // Log the error message if token verification fails
        console.error("Token verification error:", error.message);
        return null;  // Return null if token is not valid or expired
    }
}


const generateAndSaveTokens = async (userId) => {
    const accessToken = createToken({ userId }, "1h");
    const refreshToken = createToken({ userId }, "24h");
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
  
    const updatedUser = await updateUserRefreshToken(userId, hashedRefreshToken);
    if (!updatedUser) {
      throw new Error("Failed to update refresh token.");
    }
  
    return { accessToken, refreshToken };
  };


module.exports = {
    createToken,
    verifyToken,
    generateAndSaveTokens
  };
  