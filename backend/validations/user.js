const { body } = require("express-validator");

// Validation Rule Arrays for User Operations

exports.changePasswordValidations = [
  body("currentPassword")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("newPassword")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("confirmNewPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];

exports.editUserValidations = [
  body("firstName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter your first name."),
  body("lastName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter your last name."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

exports.deleteUserValidations = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];
