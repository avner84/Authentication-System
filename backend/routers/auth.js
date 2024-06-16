const express = require("express");
const router = express.Router();

// Import authentication controller functions
const {
  signup,
  verify,
  requestResendVerification,
  requestPasswordResetVerification,
  validateResetPasswordToken,
  resetPassword,
  login,
  logout,
  refreshToken
  // loginByToken,
} = require("../controllers/auth");

// Import validation middlewares for signup and login
const { signupValidations, resendVerificationValidations, verifyForPasswordReset, resetPasswordValidations, loginValidations } = require("../validations/auth");

// Import a middleware to handle validation errors
const { handleValidationErrors } = require("../validations/errorHandling");

// Import a middleware to check if the user is authenticated
const isAuth = require("../middleware/is-auth");



// Define a route for user signup with validation checks
router.post("/signup", [signupValidations, handleValidationErrors], signup);

// Define a route to resend the verification email
router.post("/resend-verification", [resendVerificationValidations, handleValidationErrors], requestResendVerification);


// Define a route to verify a user's email
router.get("/verify", verify);


router.post("/verify-for-password-reset", [verifyForPasswordReset, handleValidationErrors], requestPasswordResetVerification);


router.get("/validate-reset-password-token", validateResetPasswordToken)

router.put("/reset-password", isAuth, [resetPasswordValidations, handleValidationErrors], resetPassword)

// Define a route for user login with validation checks
router.post("/login", [loginValidations, handleValidationErrors], login);

router.get("/logout",isAuth, logout);

router.get("/refresh-token", refreshToken)



module.exports = router;
