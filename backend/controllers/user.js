require("dotenv").config();

const bcrypt = require("bcryptjs");

const { verifyToken, generateAndSaveTokens } = require("../utils/tokenService");

const {
  findUserById,
  updateUserPassword,
  deleteUserById,
  updateUserDetails,
} = require("../data-access/user");

// Change Password Function: Allows a user to change their password
exports.changePassword = async (req, res, next) => {
  const {
    userId,
    body: { currentPassword, newPassword },
  } = req;

  try {
    // Fetching the user from the database
    const user = await findUserById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return next(error);
    }

    // Verifying the current password
    const isEqual = await bcrypt.compare(currentPassword, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    // Hashing the new password and updating the user
    const hashedPw = await bcrypt.hash(newPassword, 12);
    await updateUserPassword(user, hashedPw);

    // Generating a new tokens for the user
    const { accessToken, refreshToken } = await generateAndSaveTokens(userId);

    //Sending the response with token and user details
    res.cookie("accessToken", accessToken, {
      path: "/",
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "The password has been changed successfully",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Delete User Function: Deletes a user from the database
exports.deleteUser = async (req, res, next) => {
  const {
    userId,
    body: { password },
  } = req;

  try {
    // Checking if the user exists
    const user = await findUserById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

     // Verifying the password before updating details
     const isEqual = await bcrypt.compare(password, user.password);
     if (!isEqual) {
       const error = new Error("Wrong password!");
       error.statusCode = 401;
       throw error;
     }

    // Deleting the user
    const deletedUser = await deleteUserById(userId);
    if (!deletedUser) {
      const error = new Error("User could not be deleted.");
      error.statusCode = 500;
      throw error;
    }

    // Sending a confirmation response
    res.status(200).json({ message: "User has been deleted." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Edit User Function: Allows a user to update their details
exports.userEdit = async (req, res, next) => {
  const {
    userId,
    body: { firstName, lastName, password },
  } = req;

  try {
    // Fetching the user from the database
    const user = await findUserById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    // Verifying the password before updating details
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    // Updating the user details
    const updateFields = { firstName, lastName };
    const updatedUser = await updateUserDetails(user, updateFields);

    // Generating a new tokens for the user
    const { accessToken, refreshToken } = await generateAndSaveTokens(userId);

    //Sending the response with token and user details
    res.cookie("accessToken", accessToken, {
      path: "/",
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "The user details have been updated successfully",
      user: {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
