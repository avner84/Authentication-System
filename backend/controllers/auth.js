const bcrypt = require("bcryptjs");
const { origin: CLIENT_URL } = require("../config/default");
const {
  createToken,
  verifyToken,
  generateAndSaveTokens,
} = require("../utils/tokenService");

const {
  updateUserActiveStatus,
  updateUser,
  createUser,
  findUserById,
  findUser,
  clearRefreshToken,
} = require("../data-access/auth");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailSender");

// Signup Function: Registers a new user with hashed password
exports.signup = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Hashing the password for security
  const hashedPw = await bcrypt.hash(password, 12);

  const userData = {
    firstName,
    lastName,
    email,
    password: hashedPw,
  };

  try {
    // Creates or updates a user. If the user already exists (by email) but hasn't verified their account, their details (firstName, lastName, password) are overwritten with the new ones.

    // Check if user exists
    const existingUser = await findUser({ email });

    let result;
    if (existingUser) {
      // Update existing user if not verified
      result = await updateUser(existingUser._id, userData);
    } else {
      // Create new user
      result = await createUser(userData);
    }

    const userId = result._id.toString();
    //Generate token with user information and expiration date for email address verification
    const token = createToken({ userId }, "24h");

    const isInitialEmail = true;

    // //Sending an email to verify account
    sendVerificationEmail(email, token, isInitialEmail);

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Verify Function: Handles user account verification
exports.verify = async (req, res, next) => {
  const { token } = req.query;

  try {
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      // Token is null, meaning it's invalid or expired
      return res.redirect(`${CLIENT_URL}/auth/error?type=verification_link_expired`);
    }
    const { userId } = decodedToken;

    //Update in the database that the user has been activated
    const result = await updateUserActiveStatus(userId);

    switch (result.status) {
      case "not_found":
        return res.redirect(`${CLIENT_URL}/auth/error?type=user_not_found`);
      case "already_verified":
        return res.redirect(`${CLIENT_URL}/auth/error?type=already_verified`);
      case "verified":
        return res.redirect(`${CLIENT_URL}/auth/success?type=email_verified`);
      default:
        return res.redirect(`${CLIENT_URL}/auth/error`);
    }
  } catch (err) {
    console.log("err :", err);
    // Handle other potential errors
    res.redirect(`${CLIENT_URL}/auth/error`);
  }
};

// RequestResendVerification Controller: Sends a new verification email based on email address
exports.requestResendVerification = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await findUser({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User Not Found" });
    }

    // Check if the user has already been verified
    if (user.isActive) {
      return res
        .status(200)
        .json({ status: "error", message: "already_verified" });
    }

    const userId = user._id.toString();

    //Generate token with user information and expiration date for email address verification
    const token = createToken({ userId }, "24h");

    const isInitialEmail = false;

    // //Sending an email to verify account
    sendVerificationEmail(email, token, isInitialEmail);
    return res
      .status(200)
      .json({ status: "success", message: "verification_email_sent" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: "server_error" });
  }
};


// Login Function: Authenticates a user and issues a JWT
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Checking if user exists
    const user = await findUser({ email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 404;
      throw error;
    }

    // Checking if the user's account is active
    if (!user.isActive) {
      const error = new Error("User account is not active.");
      error.statusCode = 401;
      throw error;
    }

    // Comparing the provided password with the stored hashed password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const userId = user._id.toString();
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

exports.requestPasswordResetVerification = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await findUser({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User Not Found" });
    }

    const userId = user._id.toString();

    //Generate token with user information and expiration date for email address verification
    const token = createToken({ userId }, "5m");

    // //Sending an email to verify account
    sendPasswordResetEmail(email, token);
    return res.status(200).json({
      status: "success",
      message: "password_reset_verification_email_sent",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ status: "error", message: "server_error" });
  }
};

exports.validateResetPasswordToken = async (req, res, next) => {
  const { token } = req.query;

  try {
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      // Token is null, meaning it's invalid or expired
      res.redirect(`${CLIENT_URL}/auth/error?type=password_reset_link_expired`);
    }
    const { userId } = decodedToken;

    const user = await findUserById(userId);
    if (!user) {
      res.redirect(`${CLIENT_URL}/auth/error?type=user_not_found`);
    }

    const newToken = createToken({ userId }, "5m");
    res.cookie("passwordResetToken", newToken, {
      path: "/",
      httpOnly: false,
      secure: false,
      maxAge: 5 * 60 * 1000,
    });
    res.redirect(`${CLIENT_URL}/auth/reset-password`);
  } catch (err) {
    console.log("err :", err);
    // Handle other potential errors
    res.redirect(`${CLIENT_URL}/auth/error`);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("hi from resetPassword controller");
  try {
    const user = await findUser({ email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 404;
      throw error;
    }

    const userId = user._id.toString();
    // Hashing the password for security
    const hashedPw = await bcrypt.hash(password, 12);
    const updatedUser = await updateUser(userId, { password: hashedPw });
    if (!updatedUser) {
      const error = new Error("Failed to reset password.");
      error.statusCode = 500;
      throw error;
    }

    res
      .status(201)
      .json({ message: "The password has been successfully updated!" });
  } catch (err) {
    console.log("err :", err);
    // Handle other potential errors
    res.redirect(`${CLIENT_URL}/auth/error`);
  }
};

exports.logout = async (req, res, next) => {
  const { userId } = req;

  try {
    await clearRefreshToken(userId);
    res
      .clearCookie("refreshToken", { path: "/" }) // אין צורך לציין דומיין במקרה זה
      .status(200)
      .json({ status: "success", message: "User logged out successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .clearCookie("refreshToken", { path: "/" }) // אין צורך לציין דומיין במקרה זה
      .status(500)
      .json({ status: "error", message: "server_error" });
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  console.log('refreshToken :', refreshToken);

  try {
    if (!refreshToken) {
      const error = new Error("No refresh token provided.");
      error.statusCode = 401;
      throw error;
    }

    const decodedToken = verifyToken(refreshToken);
    const { userId } = decodedToken;    

    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      const error = new Error("Invalid refresh token.");
      error.statusCode = 401;
      throw error;
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAndSaveTokens(
      userId
    );

   
    // Sending the response with new tokens
    res.cookie("accessToken", accessToken, {
      path: "/",
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Tokens refreshed successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
