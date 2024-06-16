const User = require("../models/user");

// Function to find a user by their ID
const findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw error;
  }
};

// Function to find a single user based on a query
const findUser = async (query) => {
  try {
    return await User.findOne(query);
  } catch (error) {
    throw error;
  }
};

// Function to create a new user with given user data
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to update a user by their ID with the provided user data
const updateUser = async (userId, userData) => {
  try {
    // Update and return the new user data. { new: true } ensures the updated document is returned
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to update a user's active status to true
const updateUserActiveStatus = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      return { status: "not_found" };
    }

    if (user.isActive) {
      return { status: "already_verified" };
    }

    user.isActive = true;
    await user.save();
    return { status: "verified", user };
  } catch (error) {
    throw error;
  }
};

// Function to update a user's refresh token
const updateUserRefreshToken = async (userId, newRefreshToken) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.refreshToken = newRefreshToken;
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Failed to update refresh token: ${error.message}`);
  }
};

const clearRefreshToken = async (userId) => {
  try {
    await User.updateOne({ _id: userId }, { $set: { refreshToken: "" } });
    console.log("User logged out and refresh token set to empty");
  } catch (error) {
    console.error("Error clearing refresh token for user:", error);
  }
};

module.exports = {
  findUserById,
  findUser,
  createUser,
  updateUser,
  updateUserActiveStatus,
  updateUserRefreshToken,
  clearRefreshToken,
};
